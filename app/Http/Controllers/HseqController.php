<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Hseq;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HseqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $documents = Hseq::paginate(10);
        return Inertia::render('Hseq/Index', [
            'documents' => $documents
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'hseqFilename' => 'required|string',
                'filename' => 'required|string',
            ]);

            $fileStrug = Str::slug($request->filename, '_') . '.' .'pdf';

            $fileStore = 'documents/' . $fileStrug;

            $hseq = Hseq::create([
                'hseqFilename' => $request->hseqFilename,
                'filename' => $fileStore
            ]);

            if (!$hseq) {
                throw new Exception('Error al subir el archivo', 500);
            }

            return response()->json([
                'message' => 'Archivo Subido Correctamente',
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
            ], 500);
        }
        dd($request->all());
    }

    /**
     * Download the specified resource.
     */
    public function download(string $id)
    {
        $resource = Hseq::find($id);
        $url = public_path('storage/'. $resource->filename);
        return response()->download($url);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $hseqData = Hseq::findOrFail($id);
            if(!$hseqData) throw new Exception('Objeto no Encontrado', 400);

            $fileData = $hseqData->filename;
            $file = public_path('storage/'. $fileData);
            if (!file_exists($file)) {
                throw new Exception('Archivo no Encontrado', 400);
            }

            unlink($file);
            $deleteObject = $hseqData->delete();
            if(!$deleteObject) {
                throw new Exception('Error al Eliminar el Registro', 400);
            }

            return response()->json([
                'message' => 'Archivo Eliminado'
            ], 200);

        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
