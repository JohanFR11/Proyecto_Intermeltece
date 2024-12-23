<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Google_Client;
use Google_Service_Drive;
use Google_Service_Drive_DriveFile;

class GoogleDriveController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new Google_Client();
        $this->client->setClientId('');
        $this->client->setClientSecret('');
        $this->client->setRedirectUri("http://127.0.0.1:8000/auditoria");
        $this->client->setAccessType('offline');
        $this->client->setPrompt('consent');
    }

    // Método para intercambiar el código por un token de acceso
    public function exchangeCodeForToken(Request $request)
{
    $authCode = $request->query('code');

    if (!$authCode) {
        return response()->json(['error' => 'Código de autorización no proporcionado'], 400);
    }

    try {
        $token = $this->client->fetchAccessTokenWithAuthCode($authCode);
        log::info('este es el token de acceso: ', $token);

        if (isset($token['access_token'])) {
            return response()->json([
                'access_token' => $token['access_token'],
                'expires_in' => $token['expires_in'] ?? 3600, // Tiempo predeterminado si no se especifica
            ]);
        } else {
            return response()->json(['error' => 'No se recibió el access token.'], 400);
        }
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al intercambiar el código: ' . $e->getMessage()], 500);
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


    // Método para subir un archivo a Google Drive
    public function uploadFile(Request $request)
    {
        if (!$request->hasFile('file')) {
            return response()->json(['error' => 'No se proporcionó ningún archivo'], 400);
        }

        $file = $request->file('file');

        if ($file->getSize() <= 0) {
            return response()->json(['error' => 'El archivo está vacío'], 400);
        }

        $content = file_get_contents($file->getPathname());

        $authorizationHeader = $request->header('Authorization');
        if (!$authorizationHeader || !str_starts_with($authorizationHeader, 'Bearer ')) {
            return response()->json(['error' => 'Token de autorización no proporcionado o incorrecto'], 401);
        }

        $accessToken = str_replace('Bearer ', '', $authorizationHeader);

        if ($this->isAccessTokenExpired($accessToken)) {
            // Obtener el refresh_token desde la base de datos o almacenamiento
            $refreshToken = '';
    
            if (!$refreshToken) {
                return response()->json(['error' => 'No se encontró el refresh token para renovar el acceso'], 401);
            }
    
            // Intentar refrescar el token
            $newAccessToken = $this->refreshAccessToken($refreshToken);
    
            if (!$newAccessToken) {
                return response()->json(['error' => 'No se pudo renovar el token de acceso'], 500);
            }
    
            $accessToken = $newAccessToken;
        }
        
        $this->client->setAccessToken($accessToken);
        $service = new Google_Service_Drive($this->client);

        $fileMetadata = new Google_Service_Drive_DriveFile([
            'name' => $file->getClientOriginalName(),
            'parents' => ["1CFMfx5iLuGmf9aeA24fyeIMObea-azVa"]
        ]);

        try {
            // Subir el archivo a Google Drive
            $uploadedFile = $service->files->create(
                $fileMetadata,
                [
                    'data' => $content,
                    'mimeType' => $file->getMimeType(),
                    'uploadType' => 'media',
                ]
            );
            return response()->json(['success' => true, 'file_id' => $uploadedFile->id,'name' => $uploadedFile->name]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al subir el archivo: ' . $e->getMessage()], 500);
        }
    }
    private function isAccessTokenExpired($accessToken)
{
    $this->client->setAccessToken($accessToken);

    return $this->client->isAccessTokenExpired();
}

/**
 * Obtiene el refresh token almacenado de forma segura.
 */
private function getRefreshTokenFromStorage()
{
    // Implementa la lógica para recuperar el refresh token desde tu base de datos o almacenamiento
    return env('GOOGLE_REFRESH_TOKEN'); // Ejemplo temporal, cámbialo por tu lógica real
}

/**
 * Refresca el token de acceso usando el refresh token.
 */
private function refreshAccessToken($refreshToken)
{
    try {
        $this->client->refreshToken($refreshToken);
        $newToken = $this->client->getAccessToken();

        // Actualiza el token en tu base de datos si es necesario
        return $newToken['access_token'] ?? null;
    } catch (\Exception $e) {
        return null; // Maneja el error si ocurre durante la renovación
    }
}
}

