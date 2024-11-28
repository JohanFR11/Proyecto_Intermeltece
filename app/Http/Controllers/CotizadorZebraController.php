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
            // Primera consulta: obtener subcategorías
            $data = DB::connection('sqlsrv')->select("SELECT TOP (1000) [Subcategoria Productos] As subcategoria FROM ['Lista_Zebra:Subcategoria']");
            Log::info("los datos obtenidos son data1:", ['data' => json_encode($data)]);
            
            // Segunda consulta: obtener Part Numbers
            $data2 = DB::connection('sqlsrv')->select("SELECT TOP (20700) [Part Number] AS [Part_Number] FROM [COTIZADOR].[dbo].['Catalogo Zebra Espanol']");
            Log::info("los datos obtenidos son data2:", ['data2' => json_encode($data2)]);
            
            // Retornar ambos conjuntos de datos a la vista
            return Inertia::render('Commercial/Zebra/Index', [
                'data' => $data,
                'number' => $data2, // pasar el segundo conjunto de datos
            ]);
    
        } catch (\Exception $e) {
            Log::error("Error al obtener datos de precios Zebra: {$e->getMessage()}");
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function FilterPartNum($categorySelected)
{
    try {
        Log::info("Categoría seleccionada: " . $categorySelected);  // Para verificar el valor recibido
        $numberfilter = DB::connection('sqlsrv')->select("
            SELECT [Part Number] AS [Part_Number] FROM [COTIZADOR].[dbo].['Catalogo Zebra Espanol']
            WHERE [Product Sub Category] = ?
        ", [$categorySelected]);

        if (empty($numberfilter)) {
            return response()->json([
                'numberfilter' => [],
                'message' => 'No se encontraron resultados para la categoría seleccionada.',
            ], 200);
        }

        return response()->json([
            'numberfilter' => $numberfilter, 
        ], 200);
    } catch (\Exception $e) {
        Log::error("Error al filtrar números de parte: {$e->getMessage()}");

        return response()->json([
            'error' => $e->getMessage(),
        ], 500);
    }
}


}
