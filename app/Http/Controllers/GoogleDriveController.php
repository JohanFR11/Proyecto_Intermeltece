<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Google_Client;
use Google\Client;
use Google_Service_Drive;
use Google_Service_Drive_DriveFile;

class GoogleDriveController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new Google_Client();
        $this->client->setClientId('clientid');
        $this->client->setClientSecret('secretid');
        $this->client->setRedirectUri("http://127.0.0.1:8000/auditoria");
        $this->client->setAccessType('offline');
        $this->client->setPrompt('consent');
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
            'client_id' => 'client id',
            'client_secret' => 'client secret',
            'redirect_uri' => 'http://127.0.0.1:8000/auditoria',
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
        // DB::table('users')->updateOrInsert(
        //     ['external_id' => auth()->id()],
        //     [
        //         'google_access_token' => $token['access_token'],
        //         'google_refresh_token' => $token['refresh_token'] ?? null,
        //         'expires_in' => now()->addSeconds($token['expires_in']),
        //     ]
        // );

        return response()->json([
            'access_token' => $token['access_token'],
            'refresh_token' => $token['refresh_token'] ?? null,
            'expires_in' => $token['expires_in'] ?? 3600,
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al intercambiar el código: ' . $e->getMessage()], 500);
    }
}

public function refreshAccessToken(request $request)
{
    try {

        $refreshToken=$request->input('refresh_token');
        // Obtener el refresh token del usuario autenticado
        // $user = DB::table('users')->where('external_id', auth()->id())->first();

        // if (!$user || !$user->google_refresh_token) {
        //     return response()->json(['error' => 'No se encontró un refresh token para el usuario'], 400);
        // }

        $refresh_token = $refreshToken;

        // Configuración de los parámetros para la solicitud
        $postFields = [
            'refresh_token' => $refresh_token,
            'client_id' => 'client id',
            'client_secret' => 'id secret',
            'grant_type' => 'refresh_token',
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
                'error_description' => $token['error_description'] ?? 'No se pudo renovar el token',
            ], $httpCode);
        }

        // Actualizar el token en la base de datos
        // DB::table('users')->where('id', auth()->id())->update([
        //     'google_access_token' => $token['access_token'],
        //     'expires_in' => now()->addSeconds($token['expires_in']),
        // ]);

        return response()->json([
            'access_token' => $token['access_token'],
            'expires_in' => $token['expires_in'] ?? 3600,
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
            'parents' => ["id de carpeta"]
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
public function listFiles(Request $request)
{
    $authorizationHeader = $request->header('Authorization');
        if (!$authorizationHeader || !str_starts_with($authorizationHeader, 'Bearer ')) {
            return response()->json(['error' => 'Token de autorización no proporcionado o incorrecto'], 401);
        }

        $accessToken = str_replace('Bearer ', '', $authorizationHeader);

        
    $this->client->setAccessToken($accessToken);

    $service = new Google_Service_Drive($this->client);

    try {
        // Listar archivos
        $files = $service->files->listFiles([
            'q' => "'".'id de carpeta'."' in parents",
            'fields' => 'files(id, name, mimeType, thumbnailLink, webViewLink)',
        ]);

        $fileList = [];
        foreach ($files->getFiles() as $file) {
            $fileList[] = [
                'file_name' => $file->getName(),
                'id' => $file->getId(),
                'mimeType' => $file->getMimeType(),
                'thumbnailLink' => $file->getThumbnailLink(),
                'webViewLink' => $file->getWebViewLink(),
            ];
        }

        return response()->json(['files' => $fileList]);
    } catch (\Exception $e) {
        return response()->json(['error' => 'Error al listar los archivos: ' . $e->getMessage()], 500);
    }
}

}

