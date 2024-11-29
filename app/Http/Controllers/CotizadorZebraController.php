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
            //Log::info("Los datos obtenidos son:", ['data' => $data]);

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
            
            if (empty($categorySelected)) {

                $PartNums = DB::connection('mysql')->select("SELECT * FROM catalogo_zebra_espanol");
                return response()->json([
                    'partNums' => $PartNums
                ], 200);
            }
            
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

    public function PrecioLista(Request $request)
    {
        try {
            // Obtener los números de parte seleccionados desde la solicitud
            $selectedParts = $request->input('selectedParts');

            // Asegurarse de que al menos un número de parte haya sido seleccionado
            if (empty($selectedParts)) {
                return response()->json([
                    'totalListPrice' => 0,
                ], 0);
            }

            // Inicializar el precio total
            $totalListPrice = 0;

            // Recorrer cada número de parte seleccionado y calcular su precio
            foreach ($selectedParts as $partNumber) {
                // Obtener el precio de lista para cada número de parte
                $price = DB::connection('mysql')->select("SELECT List_Price FROM catalogo_zebra_espanol WHERE Part_Number = ?", [$partNumber]);

                // Si no se encuentra el número de parte, continuar con el siguiente
                if (empty($price)) {
                    continue;
                }

                // Obtener el porcentaje de flete
                $flete = DB::connection('mysql')->select("SELECT Porcentaje_Flete FROM a4_flete");

                // Calcular el precio total con flete
                $listPriceWithFlete = $price[0]->List_Price * $flete[0]->Porcentaje_Flete;

                // Sumar el precio calculado al total
                $totalListPrice += $listPriceWithFlete;
            }

            // Devolver el precio total calculado
            return response()->json([
                'totalListPrice' => number_format($totalListPrice, 2), // Mostrar con 2 decimales
            ], 200);
        } catch (\Exception $e) {
            // Registrar el error en el log
            Log::error("Error al calcular el precio de lista: {$e->getMessage()}");

            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function FinalPrice(Request $request)
    {
        try {

            // Obtener los números de parte seleccionados desde la solicitud
            $selectedParts = $request->input('selectedParts');

            // Asegurarse de que al menos un número de parte haya sido seleccionado
            if (empty($selectedParts)) {
                return response()->json([
                    'totalFinalPrice' => 0, // Mostrar con 2 decimales
                    'descuento'=>0,
                ], 200);
            }    
            $totalDiscount = 0;
            // Inicializar el precio total
            $totalFinalPrice = 0;

            // Recorrer cada número de parte seleccionado y calcular su precio
            foreach ($selectedParts as $partNumber) {
                // Obtener el precio de lista para cada número de parte
                $price = DB::connection('mysql')->select("SELECT List_Price FROM catalogo_zebra_espanol WHERE Part_Number = ?", [$partNumber]);
                
                // Si no se encuentra el número de parte, continuar con el siguiente
                if (empty($price)) {
                    continue;
                }
                $discountCode = DB::connection('mysql')->select("SELECT Discount_Group FROM catalogo_zebra_espanol WHERE Part_Number = ?", [$partNumber]);
                $discountPercentage = DB::connection('mysql')->select("SELECT Recommended_Premier_Solution_Partner_Discount AS per_Discount FROM patametros_descuetos_zebra WHERE Discount_Code = ?", [$discountCode[0]->Discount_Group]);
                $valorVentaMeltec = $price[0]->List_Price -($price[0]->List_Price * $discountPercentage[0]->per_Discount);
                
                $aidc = DB::connection('mysql')->select("SELECT Porcentaje_Venta FROM a4_flete WHERE Oferta_Venta = 'AIDC'");
                
                $flete = DB::connection('mysql')->select("SELECT Porcentaje_Flete FROM a4_flete");
                
                // Calcular el precio total con flete
                $finalPrice = $valorVentaMeltec * $flete[0]->Porcentaje_Flete / ($aidc[0]->Porcentaje_Venta-1)*(-1);
                $listPriceWithFlete = $price[0]->List_Price * $flete[0]->Porcentaje_Flete;
                $discount= 1-($finalPrice/$listPriceWithFlete);
                $discountInt= (number_format($discount, 2))*100;
                // Sumar el precio calculado al total
                
                $totalFinalPrice += $finalPrice;
                $totalDiscount += $discountInt;
            }

            // Registrar el precio total calculado en los logs
            // Devolver el precio total calculado
            return response()->json([
                'totalFinalPrice' => number_format($totalFinalPrice, 2), // Mostrar con 2 decimales
                'descuento'=>$totalDiscount,
            ], 200);
        } catch (\Exception $e) {
            // Registrar el error en el log
            Log::error("Error al calcular el precio de lista: {$e->getMessage()}");

            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}