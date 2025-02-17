<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Google_Client;
use Google\Client;
use Google_Service_Drive;
use Google_Service_Drive_DriveFile;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Mail\TestMail;
use Mail;

class AuthGoogleDrive extends Controller
{
    private $client;

    public function __construct()
    {
        
    }

    public function generateAuthUrl(){
        $authUrl = $this->client->createAuthUrl();
        return response()->json(['auth_url' => $authUrl]);
}

    // Método para intercambiar el código por un token de acceso
    public function exchangeCodeForToken(Request $request)
{
    $authCode = $request->query('code');

    if (!$authCode) {
        return response()->json(['error' => 'Código de autorización no proporcionado'], 400);
    }

    try {
        // Configuración de los parámetros para la solicitud
        $postFields = [
            'code' => $authCode,
            'client_id' => '714516731386-9av4nplhrj4ssu4j79psumo7pur8unpl.apps.googleusercontent.com',
            'client_secret' => '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',
            'redirect_uri' => 'http://127.0.0.1:8000/dashboard',
            'grant_type' => 'authorization_code',
        ];

        // Configuración del cURL
        $ch = curl_init('https://oauth2.googleapis.com/token');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postFields));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/x-www-form-urlencoded',
        ]);

        // Ejecución de la solicitud
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if (curl_errno($ch)) {
            throw new \Exception('Error en la solicitud cURL: ' . curl_error($ch));
        }

        curl_close($ch);

        // Decodificar la respuesta JSON
        $token = json_decode($response, true);

        if ($httpCode !== 200 || isset($token['error'])) {
            return response()->json([
                'error' => $token['error'] ?? 'Error desconocido',
                'error_description' => $token['error_description'] ?? 'No se pudo obtener el token',
            ], $httpCode);
        }

        // Guardar el token en la base de datos
        $user = auth()->user(); // Asume que el usuario está autenticado
        if ($user) {
            DB::table('users')->updateOrInsert(
                ['id' => $user->id],
                [
                    'google_access_token' => $token['access_token'],
                    'google_refresh_token' => $token['refresh_token'] ?? null,
                    'expires_in' => now()->addSeconds($token['expires_in']),
                ]
            );
        }

        return response()->json([
            'access_token' => $token['access_token'],
            'refresh_token' => $token['refresh_token'] ?? null,
            'expires_in' => $token['expires_in'] ?? 3600,
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al intercambiar el código: ' . $e->getMessage()], 500);
    }
}
public function refreshAccessToken(Request $request)
{
    try {
        $refreshToken = $request->input('refresh_token');

        \Log::info('token: ' . $refreshToken);

        if (empty($refreshToken)) {
            return response()->json(['error' => 'refresh_token is required'], 400);
        }

        $postFields = [
            'refresh_token' => $refreshToken,
            'client_id' => '714516731386-9av4nplhrj4ssu4j79psumo7pur8unpl.apps.googleusercontent.com', 
            'client_secret' => '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', 
            'grant_type' => 'refresh_token',
        ];

        // Configuración de cURL
        $ch = curl_init('https://oauth2.googleapis.com/token');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postFields));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/x-www-form-urlencoded',
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if (curl_errno($ch)) {
            throw new \Exception('cURL Error: ' . curl_error($ch));
        }

        curl_close($ch);

        // Log response for debugging
        \Log::info('Google API Response: ' . $response);

        // Decodificar respuesta JSON
        $token = json_decode($response, true);

        if ($httpCode !== 200 || isset($token['error'])) {
            return response()->json([
                'error' => $token['error'] ?? 'Error desconocido',
                'error_description' => $token['error_description'] ?? 'No se pudo renovar el token',
            ], $httpCode);
        }

        return response()->json([
            'access_token' => $token['access_token'],
            'expires_in' => $token['expires_in'] ?? 3600,
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al renovar el token: ' . $e->getMessage()], 500);
    }
}



public function revokeAuthorization(Request $request)
{
    $token = $request->input('token'); // Puede ser access_token o refresh_token

    if (!$token) {
        return response()->json(['error' => 'Token no proporcionado'], 400);
    }

    try {
        $client = new \GuzzleHttp\Client();
        $response = $client->post('https://oauth2.googleapis.com/revoke', [
            'form_params' => ['token' => $token],
        ]);

        if ($response->getStatusCode() === 200) {
            return response()->json(['success' => 'Autorización revocada con éxito']);
        } else {
            return response()->json(['error' => 'No se pudo revocar la autorización'], 500);
        }
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al revocar la autorización: ' . $e->getMessage()], 500);
    }
}
}