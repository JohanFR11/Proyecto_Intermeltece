<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Serverpart;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartsController extends Controller
{
    public function index()
    {
        $parts = Serverpart::paginate(10);
        return Inertia::render('Admin/Parts/Index', [
            'parts' => $parts,
            'title' => 'Partes para cotizaciones'
        ]);
    }

    public function update(Request $request, String $id)
    {
        try {
            $part = Serverpart::find($id);
    
            $part->product = $request->input('product');
            $part->usdPrice = $request->input('usdPrice');
    
            $part->save();

            if(!$part->save()){
                throw new Exception ('Error al Actualizar el producto', 500);
            }
            return response()->json(['Message' => 'Datos Actualizados']);
            
        } catch (Exception $e) {
            return response()->json(['Message' => $e->getMessage()], 500);
        }
    }
}
