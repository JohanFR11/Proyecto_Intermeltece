<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;

class ServiceOrderController extends Controller
{
    public function create(Request $request){
        $data = $request->all();

        $usuario = 'CFRANCO';
        $contraseña = 'M3l732024**';
        $credenciales = base64_encode("$usuario:$contraseña");


        $client = new Client();
        $jar = new CookieJar();

            $response = $client->request('GET', 'https://my344023.sapbydesign.com/sap/byd/odata/cust/v1/tmserviceorder', [
                'headers' => [
                    'Authorization' => "Basic $credenciales",
                    'Content-Type' => 'application/json',
                    'x-csrf-token' => "fetch",
                ],
                'cookies' => $jar,
            ]);

            if ($response->getStatusCode() === 200) {
                $token = $response->getHeader('x-csrf-token')[0];

                $headers= [
                    'Authorization' => "Basic $credenciales",
                    'Content-Type' => 'application/json',
                    'x-csrf-token' => "$token"
                ];

                $response2 = $client->request('POST', 'https://my344023.sapbydesign.com/sap/byd/odata/cust/v1/tmserviceorder/ServiceOrderCollection', [
                    'headers' => $headers,
                    'cookies' => $jar,
                    'json' => $data,
                ]);

                if($response2->getStatusCode() === 201){

                    File::put(storage_path('logs/request.log'), '');

                    $body = $response2->getBody()->getContents();

                    Log::channel('request')->info('Response Data', ['Data' => $body]);

                    $logContent = File::get(storage_path('logs/request.log'));
                    preg_match('/<d:ObjectID>(.*?)<\/d:ObjectID>/', $logContent, $objectIdMatches);
                    preg_match('/<d:ID>(.*?)<\/d:ID>/', $logContent, $idMatches);
        
                    $objectId = $objectIdMatches[1] ?? null;
                    $id = $idMatches[1] ?? null;
                    
                    File::put(storage_path('logs/request.log'), '');

                    Log::channel('data')->info('Response', [
                        'ObjectId' => $objectId,
                        'ID' => $id,
                    ]);

                    return response()->json([
                        'message' => 'Completado',
                        'objectId' => $objectId,
                        'id' => $id
                    ], $response2->getStatusCode());
                }else{
                    return response()->json('MAL');
                }
            }else{
                return 'MAL';
            }
    }

    public function post(Request $request){

        $data = $request->all();
        $objectId = $data['ObjectId'] ?? null;

        if(!$objectId){
            return response()->json([
                'message' => 'ObjectID no proporcionado'
            ], 400);
        }


        $usuario = 'CFRANCO';
        $contraseña = 'M3l732024**';
        $credenciales = base64_encode("$usuario:$contraseña");


        $client = new Client();
        $jar = new CookieJar();

            $response = $client->request('GET', 'https://my344023.sapbydesign.com/sap/byd/odata/cust/v1/tmserviceorder', [
                'headers' => [
                    'Authorization' => "Basic $credenciales",
                    'Content-Type' => 'application/json',
                    'x-csrf-token' => "fetch",
                ],
                'cookies' => $jar,
            ]);


            if($response->getStatusCode() === 200){
            $token = $response->getHeader('x-csrf-token')[0];

            $headers = [
                'Authorization' => "Basic $credenciales",
                'Content-Type' => 'application/json',
                'x-csrf-token' => "$token",
            ];

            $response2  = $client->request('POST', "https://my344023.sapbydesign.com/sap/byd/odata/cust/v1/tmserviceorder/ServiceOrderRequestConfirmationIssue?ObjectID='$objectId'", [
                'headers' => $headers,
                'cookies' => $jar
            ]);

            if($response2->getStatusCode() === 200){
                $body = $response2->getBody()->getContents();

                File::put(storage_path('logs/data.log'), '');
                Log::channel('data')->info('Body Response', ['Body' => $body]);

                // Lee el token desde el log
                $logContent = File::get(storage_path('logs/data.log'));
                preg_match('/"Body":"(.*?)"/', $logContent, $matches);
                $bodyFromLog = $matches[1] ?? null;

                return response()->json([
                    'message' => $bodyFromLog
                ]);
            }else{
                return response()->json([
                    'message' => 'Problemas Con la Solicitud'
                ], $response2->getStatusCode());
            }
        }else{
            return response()->json([
                'message' => 'error'
            ], $response->getStatusCode());
        }
    }
}
