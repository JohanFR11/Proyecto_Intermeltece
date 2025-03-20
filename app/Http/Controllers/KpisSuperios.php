<?php
namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Google_Service_Drive;
use Google_Client;
use Illuminate\Http\Request;
use setasign\Fpdi\Tcpdf\Fpdi;
use setasign\Fpdi\PdfReader;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\Encoders\JpegEncoder;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\DB;
use App\Services\PdfSuperior;
use App\Mail\EnviarpdfFirmadoSuperior;
use App\Mail\CorreoKpisFirmadoSuperior;


class KpisSuperios extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new Google_Client();
        $this->client->setClientId(clientId: '714516731386-9av4nplhrj4ssu4j79psumo7pur8unpl.apps.googleusercontent.com');
        $this->client->setClientSecret(clientSecret: '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');
        $this->client->setRedirectUri(redirectUri: "http://127.0.0.1:8000/superior/kpis");
        $this->client->setAccessType(accessType: 'offline');
        $this->client->setPrompt(prompt: 'consent');
    }
    public function index()
    {
        return Inertia::render('Firma_Superior/Index');
    }

    public function archivosUser(Request $request)
    {
        $authorizationHeader = $request->header('Authorization');

        if (!$authorizationHeader || !str_starts_with($authorizationHeader, 'Bearer ')) {
            return response()->json(['error' => 'Token de autorización no proporcionado o incorrecto'], 401);
        }

        $accessToken = str_replace('Bearer ', '', $authorizationHeader);

        $this->client->setAccessToken($accessToken);
        $service = new Google_Service_Drive($this->client);

        $requestData = $request->all();
        \Log::info("Request recibida:", ['request' => $requestData]);

        $id_empleado = $requestData['name_super'] ?? null;

        if (!$id_empleado) {
            return response()->json(['error' => 'El nombre del empleado no fue proporcionado'], 400);
        }

        $enMayusculas = strtoupper($id_empleado);

        try {
            // Buscar carpetas en la raíz especificada
            $folders = $service->files->listFiles([
                'q' => "'1nf_9Sd6KNfVoO4Qu0UNUCdZmKZztv9Lp' in parents and mimeType='application/vnd.google-apps.folder'",
                'fields' => 'files(id, name)',
            ]);

            $foldersList = [];

            foreach ($folders->getFiles() as $folder) {
                $foldersList[] = [
                    'folder_name' => $folder->getName(),
                    'id' => $folder->getId(),
                ];
            }

            \Log::info("Carpetas obtenidas:", ['folders' => $foldersList]);

            // Buscar la carpeta exacta que coincide con el nombre del empleado
            $folderId = null;

            foreach ($foldersList as $folder) {
                if (trim(strtolower($folder['folder_name'])) === trim(strtolower($enMayusculas))) {
                    $folderId = $folder['id'];
                    break; // Detener el bucle si se encuentra una coincidencia
                }
            }

            if (!$folderId) {
                \Log::warning("No se encontró una carpeta para: {$enMayusculas}");
                return response()->json([
                    'folders' => [],
                    'files' => [],
                ]);
            }

            \Log::info("ID de la carpeta encontrada:", ['folder_id' => $folderId]);

            $folders_superior = $service->files->listFiles([
                'q' => "'{$folderId}' in parents and mimeType='application/vnd.google-apps.folder'",
                'fields' => 'files(id, name)',
            ]);

            $foldersList = [];

            foreach ($folders_superior->getFiles() as $folder) {
                $foldersList[] = [
                    'folder_name' => $folder->getName(),
                    'id' => $folder->getId(),
                ];
            }

            $folderIds = array_column($foldersList, 'id');

            // Obtener los archivos dentro de la carpeta encontrada
            $q = implode("' in parents or '", $folderIds);
            $filesfolders = $service->files->listFiles([
                'q' => "'{$q}' in parents",
                'fields' => 'files(id, name, mimeType, thumbnailLink, webViewLink, parents)',
            ]);


            $filesList = [];

            foreach ($filesfolders->getFiles() as $file) {
                $filesList[] = [
                    'file_name' => $file->getName(),
                    'id' => $file->getId(),
                    'mimeType' => $file->getMimeType(),
                    'thumbnailLink' => $file->getThumbnailLink(),
                    'webViewLink' => $file->getWebViewLink(),
                    'folder_id' => $file->getParents()[0] ?? null,
                ];
            }

            return response()->json([
                'folders' => $foldersList,
                'files' => $filesList,
            ]);
        } catch (\Exception $e) {
            \Log::error("Error al obtener archivos:", ['error' => $e->getMessage()]);
            return response()->json([
                'folders' => [],
                'files' => [],
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function firmaSuperior(Request $request)
    {

        $authorizationHeader = $request->header('Authorization');
        $accessToken = str_replace('Bearer', '', $authorizationHeader);


        $this->client->setAccessToken($accessToken);

        $service = new Google_Service_Drive($this->client);


        // Recibimos los datos enviados desde React
        $requestData = $request->all();
        /* if (!$requestData || !isset($requestData[0])) {
            return response()->json(['error' => 'Datos inválidos'], 400);
        } */

        $id_empleado = $requestData['id_user'][0];
        $id_carpeta_empleado = $requestData['id_archivo'][0];

        $data_empleado = DB::select('SELECT * FROM kpi_firma WHERE identificacion_empleado = ?', [$id_empleado]);

        \Log::info('data generada:', ['datos' => $data_empleado]);

        $firmaempleadourl = storage_path("app/public/firmas/{$id_empleado}.png");
        $firmaempleado = basename($firmaempleadourl);

        $firmasuper = $requestData['firma_superior'];
        $firmasuperior = basename($firmasuper);
        \Log::info('firma generada:', ['firmasuperior' => $firmasuperior]);


        $pdfsuperior = new PdfSuperior();
        $pdfPath = $pdfsuperior->generarPDF($data_empleado, $firmaempleado, $firmasuperior, $id_carpeta_empleado, $service);

        $data = $data_empleado = json_decode(json_encode($data_empleado), true);

        \Log::info('data generada:', ['datosdatez' => $data]);

        $info = $data[0];
        \Log::info('data generada:', ['infodatex' => $info]);

        $emailServiceSuperior = new EnviarpdfFirmadoSuperior();
        $emailNotificationSuperior = new CorreoKpisFirmadoSuperior();

        $mesajeEmpleado = $emailServiceSuperior->enviarCorreo($info['correo_empleado'], $pdfPath['filename']);
        $mensajeSuperior = $emailNotificationSuperior->enviarCorreoSuperior($info['correo_superior'], $pdfPath['filename'], $info['nombre_empleado']);

        $docuemnto = $pdfPath['filename'];
        \Log::info("ruta esperada: {$docuemnto}");


        if (file_exists($docuemnto)) {
            \Log::info("El archivo SÍ existe en el sistema: {$docuemnto}");
        } else {
            \Log::warning("El archivo NO existe en el sistema: {$docuemnto}");
        }

        if (Storage::disk('public')->exists($docuemnto)) {  // <---- CORREGIDO
            Storage::disk('public')->delete($docuemnto);  // <---- CORREGIDO
            \Log::info("Archivo eliminado: {$docuemnto}");
        } else {
            \Log::warning("Archivo no encontrado para eliminar: {$docuemnto}");
        }

        $datanombre = $info['nombre_empleado'];
        DB::update('UPDATE kpi_firma SET estado_superior = "Firmado" WHERE nombre_empleado = ? ',[$datanombre]);

        return response()->json(data: [
            'mensaje' => $mesajeEmpleado,
            'Superior' => $mensajeSuperior,
            'folder_id' => $pdfPath['folder_id'],
        ]);
    }
}
