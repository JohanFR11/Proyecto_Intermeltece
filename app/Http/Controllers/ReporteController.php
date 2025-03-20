<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\PdfService;
use App\Mail\EnviarPdfService;
use App\Mail\CorreoNotificacion;
use Google_Service_Drive;
use Google_Client;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ReporteController extends Controller
{
    private $client;

    public function __construct()
    {
        $this->client = new Google_Client();
        $this->client->setClientId(clientId: '714516731386-9av4nplhrj4ssu4j79psumo7pur8unpl.apps.googleusercontent.com');
        $this->client->setClientSecret(clientSecret: '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');
        $this->client->setRedirectUri(redirectUri: "http://127.0.0.1:8000/KpisUser");
        $this->client->setAccessType(accessType: 'offline');
        $this->client->setPrompt(prompt: 'consent');
    }
    public function generarYEnviarPDF(Request $request)
    {

        $authorizationHeader = $request->header('Authorization');
        $accessToken = str_replace('Bearer', '', $authorizationHeader);


        $this->client->setAccessToken($accessToken);

        $service = new Google_Service_Drive($this->client);


        // Recibimos los datos enviados desde React
        $requestData = $request->all();
        if (!$requestData || !isset($requestData[0])) {
            return response()->json(['error' => 'Datos inválidos'], 400);
        }
        $data = $requestData; // Tomar el primer elemento del array
        $datacorreo = $requestData[0]; // Tomar el primer elemento del array
        $datafirma = $requestData['firma'];
        $nombreFirma = basename($datafirma);  // Tomar el primer elemento del array


        \Log::info('firma generada:', ['firma' => $nombreFirma]);
        // Generamos el PDF con la información del usuario
        $pdfService = new PdfService();
        $pdfPath = $pdfService->generarPDF($data, $nombreFirma , $service);
        \Log::info(' generada:', ['pdfgenerate' => $pdfPath]);
        

        // Enviamos el PDF por correo
        $emailService = new EnviarPdfService();
        $emailNotification = new CorreoNotificacion();

        $noficicacionEmpleado = $emailService->enviarCorreo($datacorreo['correo_empleado'], $pdfPath['filename']);

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

        $datanombre = $datacorreo['nombre_empleado'];
        DB::update('UPDATE kpi_firma SET estado_empleado = "Firmado" WHERE nombre_empleado = ? ',[$datanombre]);
        DB::update('UPDATE kpi_firma SET estado_superior = "No Firmado" WHERE nombre_empleado = ? ',[$datanombre]);

        return response()->json([
            'mensaje' => $noficicacionEmpleado,
            'Superior' => $emailNotification->enviarCorreoSuperior($datacorreo['correo_superior'], $datacorreo['nombre_empleado']),
            'folder_id' => $pdfPath['folder_id'],
        ]);
        
        
    }
}
