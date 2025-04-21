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


class AuditoriasControllers extends Controller
{
    public function rolestado($rol){

        \Log::info("rol:", ['rol' => $rol]);

        $datarol = DB::select('SELECT * FROM docFirmado WHERE area_auditoria = ?',[$rol]);

        $dataFileUpdata = DB::select('SELECT * FROM docSubido WHERE area_auditoria = ?',[$rol]);

        return response()->json([
            'estadoLista' => $datarol,
            'EstadoSubir' => $dataFileUpdata,
        ]);

    }
}