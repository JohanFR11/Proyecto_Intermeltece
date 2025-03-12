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
        $username = 'intranet';
        $password = 'Meltec2025*';


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
            'url' => 'https://my345513.sapbydesign.com',
            'auth' => [
                'username' => 'SEIDORFUNCIONAL',
                'password' => 'S31d0r*2o24_'
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
    
    public function DatosModelo($Datomodelo)
{
    try {
        Log::info("Modelo recibido:", ['modelo' => $Datomodelo]);

        if (!$Datomodelo) {
            return response()->json(['error' => 'Modelo no proporcionado'], 400);
        }

        // Agregar un tiempo de espera para la conexión
        $conn = odbc_connect(
            "Driver={ODBC Driver 17 for SQL Server};Server=10.14.15.35;Database=COTIZADOR;Connection Timeout=30;", 
            'intranet', 
            'Meltec2025*'
        );

        if ($conn) {
            // Consulta SQL segura con parámetros
            $query = "SELECT * FROM PRECIOS_ULEFONE WHERE MODELO = ?";
            $stmt = odbc_prepare($conn, $query);
            odbc_execute($stmt, [$Datomodelo]);

            $data = [];
            while ($row = odbc_fetch_array($stmt)) {
                $data[] = $row;
            }

            odbc_close($conn);

            // Si no hay resultados, responde con un mensaje adecuado
            if (empty($data)) {
                return response()->json([
                    'DatosModelo' => [],
                    'message' => 'No se encontraron resultados para el modelo proporcionado.',
                ], 200);
            }

            // Retorna los resultados como respuesta JSON
            return response()->json([
                'DatosModelo' => $data,
            ], 200);
        } else {
            Log::error('Error de conexión: ' . odbc_errormsg());
            return response()->json([
                'error' => 'Error de conexión: ' . odbc_errormsg(),
            ], 500);
        }
    } catch (\Exception $e) {
        Log::error("Error al obtener los datos del modelo: {$e->getMessage()}");

        return response()->json([
            'error' => 'Error al filtrar números de parte: ' . $e->getMessage(),
        ], 500);
    }
}

    
}