<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class HomeController extends Controller
{
    public function index() 
{
    try {
        // Obtener las credenciales de la API de SAP
        $CREDENTIALS = [
            'url' => 'https://my345513.sapbydesign.com/',
            'auth' => [
                'username' => 'SEIDORFUNCIONAL',
                'password' => 'S31d0r*2o24_',
            ]
        ];

        // Establecer la zona horaria de Colombia
        date_default_timezone_set('America/Bogota');

        // Obtener la fecha actual en el formato adecuado (YYYY-MM-DDTHH:MM:SS)
        $currentDate = date('Y-m-d\TH:i:s'); // Esta es la fecha actual en formato correcto

        // Asegurémonos de que la URL esté correctamente formada
        $url = $CREDENTIALS['url'] . 'sap/byd/odata/ana_businessanalytics_analytics.svc/RPCRMCIVIB_MQ0001QueryResults?$select=TIP_SAL_EMP,CDOC_INV_DATE,TDOC_YEAR_MONTH,TIP_SALES_UNIT,KCNT_REVENUE,CIP_SALES_UNIT,TIPR_PROD_UUID,TIPR_REFO_CATCP,CIPR_REFO_CATCP,CIP_SAL_EMP&$top=99999&$filter=(CDOC_INV_DATE%20ge%20datetime%27' . urlencode($currentDate) . '%27)&$format=json';

        // Registrar la URL generada
        Log::info('URL generada para la API OData rankin: ' . $url);

        // Verificar si ya tenemos los datos de la primera petición en caché
        $cachedDataRanking = Cache::get('odata_sap_ranking_data');

        if (!$cachedDataRanking) {
            // Si no están en caché, hacer la solicitud a la API
            Log::info('Realizando la consulta a la API SAP para el ranking');

            // Iniciar la sesión cURL
            $ch = curl_init($url);

            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
            curl_setopt($ch, CURLOPT_USERPWD, $CREDENTIALS['auth']['username'] . ':' . $CREDENTIALS['auth']['password']);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Accept: application/json',
                'Content-Type: application/json'
            ]);

            // Ejecutar la solicitud y obtener la respuesta
            $response = curl_exec($ch);

            // Manejar errores de cURL
            if (curl_errno($ch)) {
                $error = curl_error($ch);
                curl_close($ch);
                Log::error('Error cURL: ' . $error);
                return response()->json(['OdataRanking' => []], 400);
            }

            // Obtener el código de estado HTTP
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            // Si la respuesta es exitosa, decodificar los datos
            if ($httpCode == 200) {
                $odataRanking = json_decode($response, true);
                Cache::put('odata_sap_ranking_data', $odataRanking, 60); // Guardar en caché por 1 hora
            } else {
                Log::error('Error al obtener datos de OData para ranking: ' . $response);
                return response()->json(['OdataRanking' => []], 400);
            }
        } else {
            // Si los datos están en caché, usar los datos guardados
            $odataRanking = $cachedDataRanking;
        }

        // Verificar que la respuesta tenga la clave 'd' y 'results'
        $resultsRanking = $odataRanking['d']['results'] ?? [];

        // Segunda URL para obtener los datos de ventas
        $urlx = $CREDENTIALS['url'] . 'sap/byd/odata/ana_businessanalytics_analytics.svc/RPCRMCIVIB_MQ0001QueryResults?$top=99999&$format=json&$select=TIP_SAL_EMP,CDOC_INV_DATE,TDOC_YEAR_MONTH,TIP_SALES_UNIT,KCNT_REVENUE,CIP_SALES_UNIT,TIPR_PROD_UUID,TIPR_REFO_CATCP,CIPR_REFO_CATCP,CIP_SAL_EMP';

        // Registrar la URL generada
        Log::info('URL generada para la API OData meta: ' . $urlx);

        // Verificar si ya tenemos los datos de la segunda petición en caché
        $cachedDataMeta = Cache::get('odata_sap_meta_data');

        if (!$cachedDataMeta) {
            // Si no están en caché, hacer la solicitud a la API
            Log::info('Realizando la consulta a la API SAP para los datos de meta');

            // Iniciar la sesión cURL
            $ch = curl_init($urlx);

            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
            curl_setopt($ch, CURLOPT_USERPWD, $CREDENTIALS['auth']['username'] . ':' . $CREDENTIALS['auth']['password']);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Accept: application/json',
                'Content-Type: application/json'
            ]);

            // Ejecutar la solicitud y obtener la respuesta
            $responsek = curl_exec($ch);

            // Manejar errores de cURL
            if (curl_errno($ch)) {
                $error = curl_error($ch);
                curl_close($ch);
                Log::error('Error cURL: ' . $error);
                return response()->json(['OdataMeta' => []], 400);
            }

            // Obtener el código de estado HTTP
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            // Si la respuesta es exitosa, decodificar los datos
            if ($httpCode == 200) {
                $odataMeta = json_decode($responsek, true);
                Cache::put('odata_sap_meta_data', $odataMeta, 60); // Guardar en caché por 1 hora
            } else {
                Log::error('Error al obtener datos de OData para meta: ' . $responsek);
                return response()->json(['OdataMeta' => []], 400);
            }
        } else {
            // Si los datos están en caché, usar los datos guardados
            $odataMeta = $cachedDataMeta;
        }

        // Verificar que la respuesta tenga la clave 'd' y 'results'
        $resultsMeta = $odataMeta['d']['results'] ?? [];

        // Pasar los datos al dashboard de Inertia
        return Inertia::render('Dashboard', [
            'OdataRanking' => $resultsRanking, 
            'OdataMeta' => $resultsMeta, 
        ]);

    } catch (\Exception $e) {
        // Manejar excepciones
        Log::error("Error al obtener datos de precios Zebra: {$e->getMessage()}");
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


    public function cumpleaños()
    {
        return Inertia::render('HomeIntranet/Fragments/ModuloCumpleaños');
    }
    public function articulos()
    {
        return Inertia::render('HomeIntranet/Fragments/ModuloArticulos');
    }
}
