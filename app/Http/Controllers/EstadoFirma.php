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


class EstadoFirma extends Controller
{
    public function estadoempleado(Request $request){

        $requestData = $request->all();

        \Log::info("data entregada: ",['data'=>$requestData]);

        $estado = $requestData['estado'];
        $nombre_empleado = $requestData['nombre_empleado'];
        $estado_vista = $requestData['estado_vista'];

        \Log::info("estado entregada: ",['estado'=>$estado]);


        DB::insert('INSERT INTO estado_firma_kpis (nombre_empleado,primer_estado,segundo_estado) VALUE (?,?,?)',[$nombre_empleado,$estado,$estado_vista]);
    }
    public function estadosuperior(Request $request){

        $requestData = $request->all();

        \Log::info("data entregada: ",['data'=>$requestData]);

        $estado = $requestData['estado'];
        $nombre_empleado = $requestData['nombre_empleado'];
        $folder_ide = $requestData['file_id'];

        \Log::info("estado entregada: ",['estado'=>$estado]);


        DB::insert('INSERT INTO estado_firma_kpis_superior (nombre_empleado,primer_estado,folder_id) VALUE (?,?,?)',[$nombre_empleado,$estado,$folder_ide]);
    }

    public function obtenerestado($accessTokenDB){

        $consulta = DB::select('SELECT primer_estado, segundo_estado FROM estado_firma_kpis WHERE nombre_empleado = ?',[$accessTokenDB]);

        return response()->json(
            data: $consulta,
        );

    } 
    public function obtenerestadosuperior($accessTokenDB){

        $consulta = DB::select('SELECT primer_estado, folder_id FROM estado_firma_kpis_superior WHERE nombre_empleado = ?',[$accessTokenDB]);

        return response()->json(
            data: [$consulta],
        );

    } 
}