<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Precios_Ulefone;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PreciosUlefoneController extends Controller
{
    public function index()
    {
        try {
            // Realiza la consulta a la base de datos
            $data = DB::connection('sqlsrv')->select('SELECT * FROM PRECIOS_ULEFONE');
            log::info("los datos obtenidos son: ",$data);
            // Verificar si los datos están vacíos
            if (empty($data)) {
                return Inertia::render('Ulefone/Index', [
                    'data' => [],
                ]);
            }

            // Si hay datos, renderiza la vista de React y pasa los datos
            return Inertia::render('Ulefone/Index', [
                'data' => $data
            ]);

        } catch (\Exception $e) {
            // Log del error, incluyendo el mensaje específico de la excepción
            Log::error("Error al obtener datos de precios Ulefone: {$e->getMessage()}");

            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}