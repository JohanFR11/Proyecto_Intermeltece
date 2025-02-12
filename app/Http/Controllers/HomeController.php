<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

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
                return response()->json(['OdataClientes' => []], 400);
            }

            // Obtener el código de estado HTTP
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            // Registrar la respuesta y el código de estado HTTP
            Log::info('Código de estado HTTP: ' . $httpCode);
            Log::info('Respuesta completa de la API: ' . $response);

            // Inicializar el arreglo de datos OData
            $odata = [];

            if ($httpCode == 200) {
                // Decodificar la respuesta JSON
                $odata = json_decode($response, true);
            } else {
                Log::error('Error al obtener datos de OData: ' . $response);
            }

            // Verificar que la respuesta tenga la clave 'd' y 'results'
            $results = $odata['d']['results'] ?? [];



            /* Esta es la odata para calcular el valor total de la meta*/

            $urlx = $CREDENTIALS['url'] . 'sap/byd/odata/ana_businessanalytics_analytics.svc/RPCRMCIVIB_MQ0001QueryResults?$top=99999&$format=json&$select=TIP_SAL_EMP,CDOC_INV_DATE,TDOC_YEAR_MONTH,TIP_SALES_UNIT,KCNT_REVENUE,CIP_SALES_UNIT,TIPR_PROD_UUID,TIPR_REFO_CATCP,CIPR_REFO_CATCP,CIP_SAL_EMP';

            // Registrar la URL generada
            Log::info('URL generada para la API OData rankin: ' . $urlx);

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

            // Registrar la respuesta y el código de estado HTTP
            Log::info('Código de estado HTTP: ' . $httpCode);
            Log::info('Respuesta completa de la API: ' . $responsek);

            // Inicializar el arreglo de datos OData
            $odataVentas = [];

            if ($httpCode == 200) {
                // Decodificar la respuesta JSON
                $odataVentas = json_decode($responsek, true);
            } else {
                Log::error('Error al obtener datos de OData: ' . $responsek);
            }

            // Verificar que la respuesta tenga la clave 'd' y 'results'
            $resultsVentas = $odataVentas['d']['results'] ?? [];


            // Pasar los datos al dashboard de Inertia
            return Inertia::render('Dashboard', [
                'OdataRanking' => $results, 
                'OdataMeta' => $resultsVentas, 
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
