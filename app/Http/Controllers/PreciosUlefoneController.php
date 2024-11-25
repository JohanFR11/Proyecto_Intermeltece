<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PreciosUlefoneController extends Controller
{
    
    protected function conn(){

        $dsn = 'YourDSNName';  
        $username = 'username';
        $password = 'password';


        $conn = odbc_connect($dsn, $username, $password);

        if ($conn) {
            // Consulta SQL
            $query = "SELECT * FROM PRECIOS_ULEFONE"; 
            

            $result = odbc_exec($conn, $query);
            
            if ($result) {

                $data = [];
                while ($row = odbc_fetch_array($result)) {
                    $data[] = $row; 
                }


                return $data;
            } else {
                echo "Error en la consulta: " . odbc_errormsg($conn);
            }

            // Cerrar la conexión
            odbc_close($conn);
        } else {
            echo "Error de conexión: " . odbc_errormsg();
        }

    } 
    
    public function index()
    {
        try {
            // Llamar al método conn() para obtener los datos
            $data = $this->conn();  // Aquí usamos $this->conn() para llamar al método

            // Registrar la información obtenida
            Log::info("Los datos obtenidos son:", ['data' => $data]);

            // Verificar si los datos están vacíos
            if (empty($data)) {
                return Inertia::render('Commercial/Ulefone/Index', [
                    'data' => [],
                    'odata' => [],
                ]);
            }

            // Si hay datos, renderiza la vista de React y pasa los datos
            return Inertia::render('Commercial/Ulefone/Index', [
                'data' => $data,
                'odata' => [],
            ]);

        } catch (\Exception $e) {
            // Log del error, incluyendo el mensaje específico de la excepción
            Log::error("Error al obtener datos de precios Ulefone: {$e->getMessage()}");

            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    public function Odata(Request $request) {
        $modelo = $request->query('modelo'); 
        
        if (!$modelo) {
            return response()->json(['message' => 'Modelo no proporcionado', 'code' => 400]);
        }
    
        $CREDENTIALS = [
            'url' => 'odataurl',
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

    }  
    
    
}
