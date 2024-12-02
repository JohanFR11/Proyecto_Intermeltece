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
            /* Log::info("los datos obtenidos son data2:", ['data2' => json_encode($data2)]); */
            
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
        // Separar las categorías seleccionadas por coma (si vienen como string)
        $categories = explode(',', $categorySelected);

        Log::info("Categorías seleccionadas: " . implode(', ', $categories));

        $numberfilter = [];

        // Iterar sobre cada categoría seleccionada
        foreach ($categories as $category) {
            $results = DB::connection('sqlsrv')->select(
                "SELECT [Part Number] AS [Part_Number] 
                 FROM [COTIZADOR].[dbo].['Catalogo Zebra Espanol'] 
                 WHERE [Product Sub Category] = ?", [$category]
            );

            // Combinar los resultados de cada categoría
            $numberfilter = array_merge($numberfilter, $results);
        }

        Log::info("Los datos obtenidos son numberfilter:", ['numberfilter' => json_encode($numberfilter)]);

        // Verificar si no hay resultados
        if (empty($numberfilter)) {
            return response()->json([
                'numberfilter' => [],
                'message' => 'No se encontraron resultados para las categorías seleccionadas.',
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

    
    public function PrecioLista(Request $request)
    {
        try {
        $selectedParts = $request->input('selectedParts');

        if(empty($selectedParts))
        {
            return response()->json([
                'error' => 'No se han seleccionado numero de partes.',
            ],400);
        }

        $totalPrice = 0;

        foreach($selectedParts as $partNumber)
        {
            $price = DB::connection('sqlsrv')->select("SELECT [List Price] AS [List_Price] FROM [COTIZADOR].[dbo].['Catalogo Zebra Espanol'] WHERE [Part Number] = ?", [$partNumber]);
            
            if(empty($price))
            {
                continue;
            }

            $flate = DB::connection('sqlsrv')->select("SELECT [PORCENTAJE FLETE] AS [PORCENTAJE_FLETE] FROM [COTIZADOR].[dbo].[A4_FLETE (Parametro)]");

            $listPriceANDFlete = $price[0]-> List_Price * $flate[0]-> PORCENTAJE_FLETE;
    
            $totalPrice += $listPriceANDFlete;

        }

        return response()->json([
            'totalPrice' => number_format($totalPrice, 2),
        ],200);

    } catch(\Exception $e){
        return response()->json([
            'error'=>$e -> getMessage(),
        ],500);
    }
    }
}
