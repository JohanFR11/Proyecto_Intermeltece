<?php

namespace App\Http\Controllers;

use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use Illuminate\Support\Facades\Log;

class ReleaseController extends Controller
{
    //
    public function release(){ 
        $cookieJar = new CookieJar();
        $objectId = '331CB3F741791EDEABFE5BA554EC1342';
        $usuario = 'BNISPERUZA';
        $contraseña = 'G414*2o13_';
        $credenciales = base64_encode("$usuario:$contraseña");
         
        $client = new Client();
        $url1 = 'https://my344023.sapbydesign.com/sap/byd/odata/cust/v1/tmserviceorder/ServiceOrderCollection';
            
        $response1 = $client->request('GET', $url1, [
                    'headers' => [
                        'Authorization' => "Basic $credenciales",
                        'Content-Type' => 'application/json',
                        'X-CSRF-Token' => 'fetch',
                    ],
                    'cookies' => $cookieJar, 
                ]);
        
        $token = $response1->getHeaderLine('x-csrf-token');
        
        $xmlContent = $response1->getBody()->getContents();

        $xmlElement = simplexml_load_string($xmlContent);

        $objectIds = [];
        
        foreach ($xmlElement->xpath('//d:ObjectID') as $objectId) {
            $objectIds[] = (string) $objectId;
        }
        
        
        $headers = [
            'Authorization' => "Basic $credenciales",
            'Content-Type' => 'application/json',
            'X-CSRF-Token' => "$token",
        ];
    
        Log::info($headers);
      
        $url2 = "https://my344023.sapbydesign.com/sap/byd/odata/cust/v1/tmserviceorder/Release?ObjectID='{$objectId}'";
      
        $response2 = $client->post($url2, [
            'headers' => $headers,
            'cookies' => $cookieJar,
        ]);
      
        return ("Realizado {$response2->getStatusCode()}");

    }

}
