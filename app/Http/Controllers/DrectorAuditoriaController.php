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
use App\Mail\EstadoCompleto;
use App\Mail\EstadoIncompleto;
use Mail;
use App\Mail\EnviarNotificacion;

class DrectorAuditoriaController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new Google_Client();
        $this->client->setClientId(clientId: '714516731386-9av4nplhrj4ssu4j79psumo7pur8unpl.apps.googleusercontent.com');
        $this->client->setClientSecret(clientSecret: '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');
        $this->client->setRedirectUri(redirectUri: "http://127.0.0.1:8000/director");
        $this->client->setAccessType(accessType: 'offline');
        $this->client->setPrompt(prompt: 'consent');
    }

    public function generateAuthUrl()
    {
        $authUrl = $this->client->createAuthUrl();
        return response()->json(data: ['auth_url' => $authUrl]);
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
                'redirect_uri' => 'http://127.0.0.1:8000/director',
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
    private function isAccessTokenExpired($accessToken)
    {
        $this->client->setAccessToken($accessToken);

        return $this->client->isAccessTokenExpired();
    }

    public function index()
    {
        try {
            return Inertia::render('Director_Auditoria/Index');
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al listar los archivos: ' . $e->getMessage()], 500);
        }
    }
    public function DocumentosFirmados(Request $request)
    {
        $authorizationHeader = $request->header('Authorization');

        if (!$authorizationHeader || !str_starts_with($authorizationHeader, 'Bearer ')) {
            return response()->json(['error' => 'Token de autorización no proporcionado o incorrecto'], 401);
        }

        $accessToken = str_replace('Bearer ', '', $authorizationHeader);

        $this->client->setAccessToken($accessToken);
        $service = new Google_Service_Drive($this->client);

        try {
            $foldersList = [];

            // Buscar carpetas en la raíz
            $folders = $service->files->listFiles([
                'q' => "'1yZ1Fpoz0vGk2z9bXWv7q4fpVxrZxWSzI' in parents and mimeType='application/vnd.google-apps.folder'",
                'fields' => 'files(id, name)',
            ]);

            foreach ($folders->getFiles() as $folder) {
                $foldersList[] = [
                    'folder_name' => $folder->getName(),
                    'id' => $folder->getId(),
                ];
            }

            \Log::info("foldersList:", ['foldersList' => $foldersList]);

            if (empty($foldersList)) {
                return response()->json(['error' => 'No se encontraron carpetas en la raíz.'], 404);
            }

            // Obtener IDs de las carpetas
            $folderIds = array_column($foldersList, 'id');
            if (empty($folderIds)) {
                return response()->json(['error' => 'No se encontraron IDs de carpetas superiores.'], 404);
            }

            \Log::info("folderIds:", ['folderIds' => $folderIds]);


            // Crear consulta para subcarpetas
            $q = implode(" or ", array_map(function ($id) {
                return "'$id' in parents";
            }, $folderIds));
            \Log::info("q:", ['q' => $q]);


            $filesfolders = $service->files->listFiles([
                'q' => $q,
                'fields' => 'files(id, name, mimeType, thumbnailLink, webViewLink, parents, owners(emailAddress))',
            ]);

            $filesList = [];
            foreach ($filesfolders->getFiles() as $file) {
                
                $folderId = $file->getParents()[0] ?? null;  // Obtener la ID del folder padre

                $folderName = null;
                if ($folderId) {
                    // Realizar una llamada para obtener los detalles del folder (nombre incluido)
                    $folder = $service->files->get($folderId, ['fields' => 'name']);
                    $folderName = $folder->getName();
                }

                $filesList[] = [
                    'file_name' => $file->getName(),
                    'id' => $file->getId(),
                    'mimeType' => $file->getMimeType(),
                    'thumbnailLink' => $file->getThumbnailLink(),
                    'webViewLink' => $file->getWebViewLink(),
                    'folder_id' => $file->getParents()[0] ?? null,
                    'folder_name' => $folderName,
                    'owner' => $file->getOwners()[0]->getEmailAddress() ?? null, // Obtener el correo del propietario
                ];                       
            }



            \Log::info("filesList:", ['filesList' => $filesList]);

            return response()->json(['files' => $filesList, 'folders' => $foldersList]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al listar los archivos: ' . $e->getMessage()], 500);
        }

    }

    public function SubirComentarioDirector(Request $request)
    {
        $comentario = $request->input('comentario');
        $fecha = $request->input('fecha');
        $fileId = $request->input('file_id');

        if (!$comentario || !$fecha || !$fileId) {
            return response()->json(['error' => 'Datos incompletos'], 400);
        }

        try {

            $formattedFecha = Carbon::parse($fecha)->format('Y-m-d H:i:s');
            // Sentencia SQL utilizando DB::insert para MySQL
            DB::insert('INSERT INTO comentarios (archivo_id, comentario ,fecha_comentario) VALUES (?, ?, ?)', [
                $fileId,
                $comentario,
                $formattedFecha,
            ]);

            return response()->json(['success' => 'Comentario guardado con éxito.']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al guardar el comentario: ' . $e->getMessage()], 500);
        }
    }

    public function obtenerComentariosDirector($fileId)
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
    public function ActualizarEstado(Request $request)
    {
        try {
            $estados = $request->input('estados');

            foreach ($estados as $estado) {
                $id = $estado['id_doc'];
                $estadoau = $estado['estado_audi'];
                $correousu = $estado['correo_user'];
                $usuario = $estado['usuario'];
                $doc_cargado = $estado['doc_cargado'];

                $user = auth()->user();

                $userRole = auth()->user()->roles->first()->name;

                $dia = Carbon::now('America/Bogota');

                DB::update('UPDATE auditoriadocs SET estado_auditoria = ? WHERE id_documento = ?', [
                    $estadoau,
                    $id,
                ]);

                if ($estadoau === "Completo") {
                    $data = [
                        'usuario' => $usuario,
                        'name' => $user->name,
                        'documento' => $doc_cargado,
                        'dia' => $dia,
                        'areaauditoria' => $userRole,
                        'estado' => $estadoau,
                    ];
                    Mail::to($correousu)->send(new EstadoCompleto($data));
                } else {
                    $data = [
                        'usuario' => $usuario,
                        'name' => $user->name,
                        'documento' => $doc_cargado,
                        'dia' => $dia,
                        'areaauditoria' => $userRole,
                        'estado' => $estadoau,
                    ];
                    Mail::to($correousu)->send(new EstadoIncompleto($data));
                }

            }
            ;

            return response()->json(['message' => 'Estados actualizados correctamente']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los comentarios: ' . $e->getMessage()], 500);
        }
    }


    public function ActualizarEstados(Request $request){

        $requestData = $request->all();
        \Log::info("requestData:", ['requestData' => $requestData]);

        try{

            $area = $requestData['area'];
            $id_folder = $requestData['id_folder'];
            $id_file = $requestData['id_file'];
            $estado = $requestData['estado'];
            $email = $requestData['email'];

            $consulta = DB::select('SELECT * FROM docFirmado WHERE area_auditoria = ? ',[$area]);

            if(!$consulta){
                DB::insert('INSERT INTO docFirmado (area_auditoria,id_folder,id_file,estado_auditoria,email_area_encargado) VALUE (?,?,?,?,?)',[$area,$id_folder,$id_file,$estado,$email]);
            }else{
                DB::update('UPDATE docFirmado SET estado_auditoria = ? WHERE area_auditoria = ?',[$estado,$area]);
            }

            $emailNotification = new EnviarNotificacion();

            $mesajeEmpleado = $emailNotification->enviarCorreoNotificaion($area);

            return response()->json(['message' => 'Estado actualizado correctamente', 'email' => $mesajeEmpleado]);


        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los comentarios: ' . $e->getMessage()], 500);
        }
    }
}