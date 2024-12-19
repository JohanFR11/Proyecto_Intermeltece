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
        $this->client->setClientId('client id de cloud console ');
        $this->client->setClientSecret('secret client id de cloud console');
        $this->client->setRedirectUri("http://127.0.0.1:8000/auditoria");
        $this->client->setAccessType('offline');
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


    // Método para renovar el token
    public function refreshAccessToken(Request $request)
    {
        $refreshToken = $request->input('refresh_token');

        if (!$refreshToken) {
            return response()->json(['error' => 'Refresh token no proporcionado'], 400);
        }

        try {
            $this->client->refreshToken($refreshToken);
            $newAccessToken = $this->client->getAccessToken();

            return response()->json([
                'access_token' => $newAccessToken['access_token'],
                'expires_in' => $newAccessToken['expires_in']
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al renovar el token: ' . $e->getMessage()], 500);
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

        $this->client->setAccessToken($accessToken);
        $service = new Google_Service_Drive($this->client);

        $fileMetadata = new Google_Service_Drive_DriveFile([
            'name' => $file->getClientOriginalName(),
            'parents' => ["ID de la carpeta"]
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
            return response()->json(['success' => true, 'file_id' => $uploadedFile->id]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al subir el archivo: ' . $e->getMessage()], 500);
        }
    }
}
