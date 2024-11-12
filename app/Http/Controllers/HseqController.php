<?php

namespace App\Http\Controllers;

use Exception;
use App\Models\Hseq;
use App\Models\Folder;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;


class HseqController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $folders = Folder::all();
        $documents = Hseq::paginate(10);

        return Inertia::render('Hseq/Index', [
            'folders' => $folders, 
            'documents' => $documents
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //Log::info('Entrando al método store');
        //Log::info('Datos recibidos: ', $request->all());

        try {
            $request->validate([
                'hseqFilename' => 'required|string',
                'filename' => 'required|string',
                'category'=> 'required|int|exists:folders,folder_id',
            ]);

            $fileStrug = Str::slug($request->filename, '_') . '.' .'pdf';

            $fileStore = 'documents/' . $fileStrug;

            $categoryId=$request->category;

            $hseq = Hseq::create([
                'category' => $categoryId,
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

    public function filterDocuments(Request $request)
    {

        //Log::info('Datos recibidos: ', $request->all());

        $folderId =$request->folder_id;

        if ($folderId == '1') {
            $documents = Hseq::paginate(10);
        } else {
            $documents = Hseq::where('category', $folderId)->paginate(10);
        }
        // $documents = Hseq::where('category', $folderId)
        // ->select('id','hseqFilename', 'filename')
        // ->paginate(10);
    
        // Devuelve los documentos filtrados a la vista
        return Inertia::render('Hseq/Index', [
            'documents' => $documents,
            'folders' => Folder::all()
        ]);
    }

    public function CreateFolder(Request $request) 
    { 
        try{
            $request->validate([ 'name' => 'required|string|max:255', ]); 
            $folder = Folder::create([ 'name' => $request->input('name'), ]); 
            return response()->json([
                'message' => 'Carpeta creada correctamente',
            ], 201);
        }catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
            ], 500);
        }
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
