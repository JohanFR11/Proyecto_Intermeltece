<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Google_Service_Drive;
use Google_Client;

class KpisFirmaController extends Controller
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
    public function index(){
        return Inertia::render('Firma_Kpis/Index');
    }
    public function kpisinfouser($name){
        
        Log::info("respuesta:", ['email' => $name]);

        $mayusculas = strtoupper($name);

        try{    

            $kpisdata = DB::select('SELECT * FROM kpi_firma WHERE nombre_empleado = ?', [$mayusculas]);

            Log::info("respuesta:", ['data' => $kpisdata]);

            return response()->json(['kpisuser' => $kpisdata]);

        }catch (\Exception $e) {
            // Manejar excepciones
            Log::error("Error al obtener datos de los kpis {$e->getMessage()}");
            return response()->json(['error' => $e->getMessage()], 500);
        }

    }

    public function PrevKpi(Request $request,$folderID){
        $authorizationHeader = $request->header('Authorization');
        $accessToken = str_replace('Bearer', '', $authorizationHeader);


        $this->client->setAccessToken($accessToken);

        $service = new Google_Service_Drive($this->client);

        try {
            $filesfolders = $service->files->listFiles([
                'q' => "'$folderID' in parents",
                'fields' => 'files(id, name, mimeType, thumbnailLink, webViewLink)',
            ]);
            $filesList = [];

            foreach ($filesfolders->getFiles() as $files) {
                $filesList[] = [
                    'file_name' => $files->getName(),
                    'id' => $files->getId(),
                    'mimeType' => $files->getMimeType(),
                    'thumbnailLink' => $files->getThumbnailLink(),
                    'webViewLink' => $files->getWebViewLink(),
                ];
            }

            return response()->json(['files' => $filesList]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al listar los archivos: ' . $e->getMessage()], 500);
        }
    }
}