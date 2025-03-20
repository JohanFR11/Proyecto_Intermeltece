<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FirmaController extends Controller
{
    public function guardarFirma(Request $request)
    {

        $requestData = $request->all();
        $identificacion = $requestData['id_user'];

        if ($request->hasFile('firma')) {
            $file = $request->file('firma');
            $nombrearchivo = $identificacion . '.png';
            $path = $file->storeAs('firmas',$nombrearchivo, 'public'); // Guarda en storage/app/public/firmas
            $url = asset("storage/" . str_replace("public/", "", $path)); 
            return response()->json(['url' => $url]);
        }

        return response()->json(['error' => 'No se recibió una firma'], 400);
    }
    public function guardarFirmaSuperior(Request $request)
    {
        if ($request->hasFile('firma')) {
            $file = $request->file('firma');
            $path = $file->store('firmasuperior', 'public'); // Guarda en storage/app/public/firmas
            $url = asset("storage/" . str_replace("public/", "", $path)); 
            return response()->json(['url' => $url]);
        }

        return response()->json(['error' => 'No se recibió una firma'], 400);
    }
}
