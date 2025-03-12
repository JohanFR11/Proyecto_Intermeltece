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

class DrectorAuditoriaController extends Controller
{
    public function index()
    {
        try {

            $datosfull =  DB::select('SELECT * FROM auditoriadocs');

            return Inertia::render('Director_Auditoria/Index',[
                'data' => $datosfull,
            ]);
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
        try{
            $estados = $request->input('estados');

            foreach ($estados as $estado)
            {
                $id = $estado['id_doc'];
                $estadoau = $estado['estado_audi'];
                $correousu = $estado['correo_user'];
                $usuario = $estado['usuario'];
                $doc_cargado = $estado['doc_cargado'];

                $user = auth()->user();

                $userRole = auth()->user()->roles->first()->name;

                $dia = Carbon::now('America/Bogota');

                DB::update('UPDATE auditoriadocs SET estado_auditoria = ? WHERE id_documento = ?',[ 
                    $estadoau,
                    $id,
                ]);

                if($estadoau === "Completo")
                {
                    $data = [
                        'usuario' => $usuario,
                        'name' => $user -> name,
                        'documento' => $doc_cargado,
                        'dia' => $dia,
                        'areaauditoria' => $userRole,
                        'estado' => $estadoau,
                    ];
                    Mail::to($correousu)->send(new EstadoCompleto($data));
                }else{
                    $data = [
                        'usuario' => $usuario,
                        'name' => $user -> name,
                        'documento' => $doc_cargado,
                        'dia' => $dia,
                        'areaauditoria' => $userRole,
                        'estado' => $estadoau,
                    ];
                    Mail::to($correousu)->send(new EstadoIncompleto($data));
                }

            };

            return response()->json(['message' => 'Estados actualizados correctamente']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error al obtener los comentarios: ' . $e->getMessage()], 500);
        }
    }
}