<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use GuzzleHttp\Client;
use GuzzleHttp\Cookie\CookieJar;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;

class MoodleAuthController extends Controller
{

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'required',
        ]);

        $moodleUrl= "https://fleet-cub-able.ngrok-free.app/moodle";
        $client= new Client([
            'verify' => false,
        ]);
        $cookieJar = new CookieJar(); 
        
        $getResponse =$client->request('GET', "$moodleUrl/login/index.php",[ 
            'cookies' => $cookieJar, 
        ]);

        // Extrae el logintoken del HTML recibido
        preg_match('/name="logintoken" value="(.+?)"/', $getResponse->getBody(), $matches);
        $logintoken = $matches[1] ?? null;
        
        if (!$logintoken) {
            return response()->json(['error' => 'No se pudo obtener el logintoken'], 400);
        }    

        $response = $client->request('POST',"$moodleUrl/login/index.php", [
            'form_params' => [
                'logintoken' => $logintoken,
                'username' => $request->username,
                'password' => $request->password,
            ],
            'headers' => [
                'Content-Type' => 'application/x-www-form-urlencoded',
            ],
            'cookies' => $cookieJar,
            'allow_redirects' => true,
        ]);
        
        $cookies = $cookieJar->toArray();

        $responseToken = $client->request('GET', "$moodleUrl/login/token.php", [
            'query' => [
                'username' => $request->username,
                'password' => $request->password,
                'service'  => 'moodle_ws'
            ],
            'cookies' => $cookieJar,
        ]);

        $data =json_decode($responseToken->getBody(), true);

        
        if (isset($data['token'])) {
            Session::put('moodle_token', $data['token']);
            Session::save();
            
            $userResponse =$client->request('GET', "$moodleUrl/webservice/rest/server.php",[
                'query'=> [
                    'wstoken' => $data['token'],
                    'wsfunction' => 'core_webservice_get_site_info',
                    'moodlewsrestformat' => 'json'
                    ],
                    'cookies' => $cookieJar,
            ]);
            
            $userData= json_decode($userResponse->getBody(), true);

            // Extrae las cookies de la sesión de Moodle
            $moodleSession = null;
            $moodleID = null;

            foreach ($cookieJar->toArray() as $cookie) {
                if (strpos($cookie['Name'], 'MOODLEID1_') !== false) {
                    $moodleID = $cookie;
                }
                if ($cookie['Name'] === 'MoodleSession') {
                    $moodleSession = $cookie;
                }
            }

            // Verifica que ambas cookies existan antes de devolverlas
            $response = response()->json([
                'message' => 'Login exitoso en Moodle',
                'cookies' => $cookies, 
                'token' => $data,
                'userData' => $userData,
            ]);

            if ($moodleSession) {
                $response->withCookie(cookie(
                    $moodleSession['Name'],
                    $moodleSession['Value'],
                    0,
                    $moodleSession['Path'],
                    $moodleSession['Domain'],
                    true, // Secure=false en local, debe ser true en producción con HTTPS
                    true, // HttpOnly=true para mayor seguridad
                    'None'
                ));
            }
    
            if ($moodleID) {
                $response->withCookie(Cookie(
                    $moodleID['Name'],
                    $moodleID['Value'],
                    $moodleID['Expires'],
                    $moodleID['Path'],
                    $moodleID['Domain'],
                    true, 
                    true,
                    true, 
                    'None'
                ));
            }
    
            return $response;

        } else {
            return response()->json(['error' => $data['error'] ?? 'Autenticación fallida'], 401);
        }
    }

    // public function register(Request $request)
    // {
    //     $request->validate([
    //         'username' => 'required',
    //         'password' => 'required|min:8',
    //         'firstname' => 'required',
    //         'lastname' => 'required',
    //         'email' => 'required|email',
    //     ]);


    //     $client = new Client([
    //         'verify' => false,
    //     ]);
    
    //     try {
    //         $response = $client->post(self::moodleUrl, [
    //             'form_params' => [
    //                 'wstoken' => self::token,
    //                 'wsfunction' => 'core_user_create_users',
    //                 'moodlewsrestformat' => 'json',
    //                 'users' => [
    //                     [
    //                         'username' => $request->username,
    //                         'firstname' => $request->firstname,
    //                         'lastname' => $request->lastname,
    //                         'email' => $request->email,
    //                         'password' => $request->password,
    //                         'auth' => 'manual',
    //                     ]
    //                 ]
    //             ]
    //         ]);
    
    //         $userData = json_decode($response->getBody(), true);

    //         if (isset($userData[0]['id'])) {
    //             // Obtener token del nuevo usuario
    //             return $this->login(new Request([
    //                 'username' => $request->username,
    //                 'password' => $request->password,
    //             ]));
    //         }
    //         return response()->json(['error' => 'Error al registrar usuario', 'data'=> $userData], 400);

    //     } catch (RequestException $e) {
    //         return response()->json([
    //             'error' => 'Error en la solicitud backend',
    //             'message' => $e->getMessage(),
    //         ], 500);
    //     }
    // }
}
