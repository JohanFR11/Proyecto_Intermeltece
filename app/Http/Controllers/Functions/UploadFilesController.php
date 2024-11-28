<?php

namespace App\Http\Controllers\Functions;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UploadFilesController extends Controller
{
    public function __invoke(Request $request)
    {
        try {
            if ($request->hasFile('filename')) {
                $file = $request->file('filename');
                $filename = $file->getClientOriginalName();
                $extension = pathinfo($filename, PATHINFO_EXTENSION);
                $fileStrug = Str::slug(pathinfo($filename, PATHINFO_FILENAME), '_') . '.' . $extension;

                // Guarda el archivo en la carpeta 'documents/'
                $file->storeAs('documents/', $fileStrug);

                return response()->json(['filename' => $fileStrug, 'message' => 'Archivo subido con éxito'], 200);
            }
            return response()->json(['message' => 'No se proporcionó archivo'], 400);
        } catch (\Exception $e) {
            Log::error('Error al subir archivo: ' . $e->getMessage());
            return response()->json(['message' => 'Error interno en el servidor'], 500);
        }
    }
}

