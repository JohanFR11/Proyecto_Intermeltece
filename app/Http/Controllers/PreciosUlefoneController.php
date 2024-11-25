<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Precios_Ulefone;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PreciosUlefoneController extends Controller
{
    public function index(Request $request)
{
    try {
        $data = DB::connection('sqlsrv')->select('SELECT * FROM PRECIOS_ULEFONE');
        log::info("los datos obtenidos son: ",$data);
        
        return Inertia::render('Ulefone/Index', [
            'data' => $data,
            'odata' => [],
        ]);

    } catch (\Exception $e) {
        Log::error("Error al obtener datos de precios Ulefone: {$e->getMessage()}");
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

    public function Odata(Request $request) {
        $modelo = $request->query('modelo'); 
        
        if (!$modelo) {
            return response()->json(['message' => 'Modelo no proporcionado', 'code' => 400]);
        }
    
        $CREDENTIALS = [
            'url' => 'url',
            'auth' => [
                'username' => 'username',
                'password' => 'password'
            ]
        ];

        $url = $CREDENTIALS['url'] . '/sap/byd/odata/ana_businessanalytics_analytics.svc/RPSCMINVV02_Q0001QueryResults?$select=TPROD_CAT_UUID,CMATERIAL_UUID,TMATERIAL_UUID,TLOG_AREA_UUID,KCON_HAND_STOCK&$top=99999&$filter=CMATERIAL_UUID%20eq%20%27'. urlencode($modelo) .'%27&$format=json';

        Log::info('URL generada para la API OData: ' . $url);

        $ch = curl_init($url);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
        curl_setopt($ch, CURLOPT_USERPWD, $CREDENTIALS['auth']['username'] . ':' . $CREDENTIALS['auth']['password']);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'Content-Type: application/json'
        ]);
    
        $response = curl_exec($ch);

        if(curl_errno($ch)) {
            $error = curl_error($ch);
            curl_close($ch);
            Log::error('Error cURL: ' . $error);
            return response()->json(['message' => 'Error al traer los resultados', 'errorData' => $error, 'code' => 400]);
        }

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        Log::info('Código de estado HTTP: ' . $httpCode);
        Log::info('Respuesta completa de la API: ' . $response);

        if ($httpCode == 200) {
            $data = json_decode($response, true);

            if (empty($data['d']['results'])) {
                return response()->json(['message' => 'No hay resultados', 'data' => [], 'code' => 200]);
            } else {
                return response()->json(['message' => 'Datos obtenidos correctamente', 'data' => $data['d']['results'], 'code' => 200]);
            }
        } else {
            Log::error('Error al obtener datos de OData: ' . $response); 
            return response()->json(['message' => 'Error al traer los resultados', 'errorData' => $response, 'code' => 400]);
        }
        Log::info('Respuesta completa de la API OData: ' . print_r($data, true));

    }    
    
}
