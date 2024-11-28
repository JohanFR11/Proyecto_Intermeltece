<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class CotizadorZebraController extends Controller 
{
    
    public function index()
    {
        try {

            $data =DB::connection('mysql')->select("SELECT * FROM subcategoriaszebra");

            // Registrar la información obtenida
            Log::info("Los datos obtenidos son:", ['data' => $data]);

            // Verificar si los datos están vacíos
            if (empty($data)) {
                return Inertia::render('Commercial/Zebra/Index', [
                    'data' => [],
                ]);
            }

            // Si hay datos, renderiza la vista de React y pasa los datos
            return Inertia::render('Commercial/Zebra/Index', [
                'data' => $data,
            ]);

        } catch (\Exception $e) {
            // Log del error, incluyendo el mensaje específico de la excepción
            Log::error("Error al obtener datos de Zebra: {$e->getMessage()}");

            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function FilterPartNum($categorySelected)
    {
        try{
            $PartNums = DB::connection('mysql')->select("
                SELECT * FROM catalogo_zebra_espanol 
                WHERE Product_Sub_Category = ?
            ", [$categorySelected]);

            if (empty($PartNums)) {
                return response()->json([
                    'partNums' => [],
                    'message' => 'No se encontraron resultados para la categoría seleccionada.',
                ], 200);
            }
    
            // Devolver los resultados en formato JSON
            return response()->json([
                'partNums' => $PartNums,
            ], 200);
        } catch (\Exception $e) {
            // Log del error para debugging
            Log::error("Error al filtrar números de parte: {$e->getMessage()}");
    
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}