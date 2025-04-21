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
use Google\Service\Drive;

class GoogleDriveController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new Google_Client();
        $this->client->setClientId(clientId: '714516731386-9av4nplhrj4ssu4j79psumo7pur8unpl.apps.googleusercontent.com');
        $this->client->setClientSecret(clientSecret: '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');
        $this->client->setRedirectUri(redirectUri: "http://127.0.0.1:8000/auditoria");
        $this->client->setAccessType(accessType: 'offline');
        $this->client->setPrompt(prompt: 'consent');
    }

    public function generateAuthUrl()
    {
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
                'client_id' => '',
                'client_secret' => '',
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


    // Método para subir un archivo a Google Drive
    public function uploadFile(Request $request, $subFolderId)
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
            'parents' => [$subFolderId]
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

            $user = auth()->user();

            $userRole = auth()->user()->roles->first()->name;

            $estado = 'Pendiente';
            $docu = 'documento auditoria no1';

            DB::insert('INSERT INTO auditoriadocs (usuario,correo,area_usuario,documento,documento_cargado,fecha_cargue,archivo_id,estado_auditoria) VALUES (?,?,?,?,?,?,?,?)', [
                $user->name,
                $user->email,
                $userRole = auth()->user()->roles->first()->name,
                $docu,
                $uploadedFile->getName(),
                Carbon::now('America/Bogota'),
                $uploadedFile->getId(),
                $estado,
            ]);

            $dia = Carbon::now('America/Bogota');
            $area = auth()->user()->roles->first()->name;

            $data = [
                'name' => $user->name,
                'documento' => $uploadedFile->getName(),
                'dia' => $dia,
                'areaauditoria' => $area,
            ];
            Mail::to($user->email)->send(new TestMail($data));


            return response()->json(['success' => true, 'file_id' => $uploadedFile->id, 'name' => $uploadedFile->name]);
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
        try {

            $userRole = auth()->user()->roles->first()->name;

            $datosPorArea = DB::select('SELECT * FROM auditoriadocs WHERE area_usuario = ?', [$userRole]);

            return response()->json(['files' => $datosPorArea]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al listar los archivos: ' . $e->getMessage()], 500);
        }
    }

    public function obtenerComentarios($fileId)
    {
        try {
            $comentarios = DB::table('comentarios')
                ->where('archivo_id', $fileId) // Suponiendo que cada comentario tiene un file_id
                ->orderBy('fecha_comentario', 'desc')
                ->get();

            return response()->json($comentarios);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los comentarios: ' . $e->getMessage()], 500);
        }
    }

    public function listarCarpetas(Request $request)
    {
        $authorizationHeader = $request->header('Authorization');
        if (!$authorizationHeader || !str_starts_with($authorizationHeader, 'Bearer ')) {
            return response()->json(['error' => 'Token de autorización no proporcionado o incorrecto'], 401);
        }

        $accessToken = str_replace('Bearer ', '', $authorizationHeader);


        $this->client->setAccessToken($accessToken);

        $service = new Google_Service_Drive($this->client);

        $userRole = auth()->user()->roles->first()->name;

        $folderSegunRol = [
            'Auditoria Almacen' => '1BqlewLXn0fERv887BeENRgMUI2zcJdKc',
            'Auditoria Contabilidad' => '1d-W1q1sxQ8apkVYy7Nbh8KBsJgXYERyx',
            'Auditoria HSEQ' => '16m0Zn3XNZ2wtVMBSI27HDxPG47F488Yk',
            'Administrador' => '1Htykf-CVf03zRn4YToD8jvGFfjy7uJ-F',
        ];

        if (!isset($folderSegunRol[$userRole])) {
            return response()->json(['error' => 'Acceso Denegado'], 403);
        }

        $FolderId = $folderSegunRol[$userRole];

        try {
            // Listar archivos
            $folders = $service->files->listFiles([
                'q' => "'$FolderId' in parents and mimeType='application/vnd.google-apps.folder'",
                'fields' => 'files(id, name)',
            ]);

            $AñoActual = date('Y');

            $habilitadas = [
                "Trimestre Uno" => "$AñoActual-01-01",
                "Trimestre Dos" => "$AñoActual-04-01",
                "Trimestre Tres" => "$AñoActual-07-01",
                "Trimestre Cuatro" => "$AñoActual-10-01",
                "Semestre Uno" => "$AñoActual-01-01",
                "Semestre Dos" => "$AñoActual-07-01",
                "Anual" => "$AñoActual-01-01",
            ];


            $foldersList = [];

            foreach ($folders->getFiles() as $folder) {
                $foldersList[] = [
                    'folder_name' => $folder->getName(),
                    'id' => $folder->getId(),
                ];
            }

            return response()->json(['folders' => $foldersList]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al listar los archivos: ' . $e->getMessage()], 500);
        }
    }

    public function ListarSubCarpetas(Request $request, $Id_carpeta)
    {

        if (!$Id_carpeta) {
            return response()->json(['error' => 'Modelo no proporcionado'], 400);
        }

        $authorizationHeader = $request->header('Authorization');
        if (!$authorizationHeader || !str_starts_with($authorizationHeader, 'Bearer ')) {
            return response()->json(['error' => 'Token de autorización no proporcionado o incorrecto'], 401);
        }

        $accessToken = str_replace('Bearer ', '', $authorizationHeader);


        $this->client->setAccessToken($accessToken);

        $service = new Google_Service_Drive($this->client);


        try {
            // Listar archivos
            $subfolders = $service->files->listFiles([
                'q' => "'$Id_carpeta' in parents and mimeType='application/vnd.google-apps.folder'",
                'fields' => 'files(id, name)',
            ]);

            $subfoldersList = [];

            foreach ($subfolders->getFiles() as $folder) {
                $subfoldersList[] = [
                    'subfolder_name' => $folder->getName(),
                    'sub_id' => $folder->getId(),
                ];
            }

            return response()->json(['subfolders' => $subfoldersList]);


        } catch (\Exception $e) {
            Log::error("Error al filtrar números de parte: {$e->getMessage()}");

            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function archivosArticulos(Request $request)
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
                'q' => "'" . '1td58nj24FCs35iKNlSjlyJkBd-9hZFuY' . "' in parents",
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

    public function SubirArchivo(Request $request)
    {

        $authorizationHeader = $request->header('Authorization');
        $accessToken = str_replace('Bearer', '', $authorizationHeader);


        $this->client->setAccessToken($accessToken);

        $service = new Google_Service_Drive($this->client);

        $requestData = $request->all();
        log::info('dataxxsxa', ['envia' => $requestData]);

        try {

            $area = $requestData['folder_id'];
            $file = $requestData['file'];
            $carpetaRaizId = '1yZ1Fpoz0vGk2z9bXWv7q4fpVxrZxWSzI';

            $folderSuperiorId = $this->buscarCarpetaEnDrive($service, $area, $carpetaRaizId);

            if (!$folderSuperiorId) {
                log::info('NO SE ENCONTRO NADA ');
            }

            $fileUpload = new Drive\DriveFile([
                'name' => $file->getClientOriginalName(),
                'parents' => [$folderSuperiorId],
            ]);

            $contenido = file_get_contents($file->getPathname());
            $updata = $service->files->create($fileUpload, [
                'data' => $contenido,
                'mimeType' => 'application/pdf',
                'uploadType' => 'multipart',
            ]);

            sleep(2);

            $archivoCarpeta = $service->files->listFiles([
                'q' => "'" . "{$folderSuperiorId}" . "' in parents",
                'fields' => 'files(id, name, mimeType, thumbnailLink, webViewLink)',
            ]);

            $fileList = [];
            foreach ($archivoCarpeta->getFiles() as $file) {
                $fileList[] = [
                    'file_name' => $file->getName(),
                    'id' => $file->getId(),
                    'mimeType' => $file->getMimeType(),
                    'thumbnailLink' => $file->getThumbnailLink(),
                    'webViewLink' => $file->getWebViewLink(),
                ];
            }
            \Log::info("fileList:", ['fileList' => $fileList]);

            $estado = 0;
            $estado_dos = 1;
            $idfile = $fileList[0]['id'];
            $idfolder = $folderSuperiorId;

            DB::insert('INSERT INTO docSubido (area_auditoria,id_folder,id_file,estado_file,estado_file_dos) VALUES (?,?,?,?,?)',[$area,$idfile,$idfolder,$estado,$estado_dos]);

            return response()->json([
                'message' => 'Archivo subido exitosamente',
                'link' => "https://drive.google.com/file/d/{$updata->id}/view"
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al listar los archivos: ' . $e->getMessage()], 500);
        }

    }

    private function buscarCarpetaEnDrive($service, $nombreCarpeta, $parentId)
    {

        if (!$parentId) {
            \Log::error("El parentId está vacío o incorrecto");
            return null;
        }

        $query = "name contains '{$nombreCarpeta}' and mimeType = 'application/vnd.google-apps.folder' and '{$parentId}' in parents and trashed = false";


        try {
            $folders = $service->files->listFiles([
                'q' => $query,
                'spaces' => 'drive',
                'fields' => 'files(id, name)'
            ]);

            if (count($folders->getFiles()) > 0) {
                $folderId = $folders->getFiles()[0]->getId();
                \Log::info("Carpeta encontrada", ['nombre' => $nombreCarpeta, 'id' => $folderId]);
                return $folderId;
            } else {
                \Log::error("No se encontró la carpeta", ['nombreCarpeta' => $nombreCarpeta, 'parentId' => $parentId]);
                return null;
            }
        } catch (\Exception $e) {
            \Log::error("Error al buscar la carpeta", ['error' => $e->getMessage()]);
            return null;
        }

    }
}
