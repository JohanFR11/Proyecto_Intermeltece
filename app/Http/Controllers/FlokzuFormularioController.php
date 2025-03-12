<?php

namespace App\Http\Controllers;

use App\Models\flokzuFormulario;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Http\Request;

class FlokzuFormularioController extends Controller
{

    public function conexionFlokzu(Request $request){
        $jsonData = $request->all();
        /*$instanceId = $jsonData['Payload']['reference'];

        $apiKey = '3e107df6c3060dd1e868b6256269522fa95e2a020b5a005f';
        $user = 'mlerma@meltec.com.co';

        $urlFlokzu = 'https://app.flokzu.com/flokzuopenapi/api/';

        $client = new Client();
        $headers = [
            'X-Api-Key' => $apiKey,
            'X-Username' => $user,
            'Content-Type' => 'application/json',
        ];

        try {
            
            if(!is_null($instanceId)){
            $response1 = $client->request('GET', $urlFlokzu . 'v2/process/instance', [
                'headers' => $headers,
                'json' => [ 
                    'identifier' => $instanceId
                ],
            ]);
    
            if($response1->getStatusCode() === 200){
                $jsonResponse = $response1->getBody()->getContents();
    
                $data = json_decode($jsonResponse, true);
                $identificadorCumplimiento = $data['data']['fields']['Indicador de cumplimiento'];
    
                foreach($identificadorCumplimiento as $indicador){
    
                $identificador = $instanceId;
                $nombre = $data['data']['fields']['Nombre'];
                $cedula = $data['data']['fields']['Cédula'];
                $año = $data['data']['fields']['Año'];
                $mes = $data['data']['fields']['Mes de cumplimiento del KPI'];
            
                $formulario = new flokzuFormulario();
                $formulario->identificador = $identificador;
                $formulario->nombre = $nombre;
                $formulario->nombre_indicador = $indicador['NOMBRE INDICADOR'];
                $formulario->periodicidad_indicador = $indicador['PERIODICIDAD'];
                $formulario->porcentaje_indicador = $indicador['PORCENTAJE'];
                $formulario->mes_de_cumplimiento_del_KP1 = $mes ;
                $formulario->año = $año ;
                $formulario->cedula = $cedula ;
        
                $formulario->save();
                }
                return response()->json([
                    'Datos' => 'CORRECTMENTE'
                ], 200);
            
            };
            }else{
            
                return response()->json(['error' => 'Experimentamos un error']);
            }
        }catch(RequestException $e){
            if ($e->hasResponse()){
                
                dd($e);
            
                return $e;

                
            }else{
                return response()->json(['error' => 'error al conectarse al api de Flokzu']);
            }
        }


    }*/
}
}