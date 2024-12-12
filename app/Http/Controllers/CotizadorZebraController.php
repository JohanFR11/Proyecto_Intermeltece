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
            Log::info("los datos obtenidos son datosporsi:", ['datosporsi' => json_encode($data2)]); 
            
            $CREDENTIALS = [
                'url' => 'https://my345513.sapbydesign.com/',
                'auth' => [
                    'username' => 'SEIDORFUNCIONAL',
                    'password' => 'S31d0r*2o24_'
                ]
            ];

            $url = $CREDENTIALS['url'] . 'sap/byd/odata/cust/v1/clientesv3/CustomerCollection?$format=json&$select=NombreCliente&$filter=LifeCycleStatusCode%20eq%20%272%27&$top=100000&$expand=Relationship';

            Log::info('URL generada para la API OData: ' . $url);

            $ch = curl_init($url);

            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
            curl_setopt($ch, CURLOPT_USERPWD, $CREDENTIALS['auth']['username'] . ':' . $CREDENTIALS['auth']['password']);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Accept: application/json',
                'Content-Type: application/json'
            ]);

            $response = curl_exec($ch);

            if (curl_errno($ch)) {
                $error = curl_error($ch);
                curl_close($ch);
                Log::error('Error cURL: ' . $error);
                return response()->json(['OdataClientes' => []], 400);
            }

            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            Log::info('Código de estado HTTP: ' . $httpCode);
            Log::info('Respuesta completa de la API: ' . $response);

            $odata = [];
            if ($httpCode == 200) {
                $odata = json_decode($response, true);
            } else {
                Log::error('Error al obtener datos de OData: ' . $response);
            }
            
            // Retornar ambos conjuntos de datos a la vista
            return Inertia::render('Commercial/Zebra/Index', [
                'data' => $data,       // Datos de la primera consulta
                'datosporsi' => $data2,// Datos de la segunda consulta
                'odataClientes' => $odata['d']['results'] ?? [] // Datos de la API OData (asegurando que sea un array)
            ]);

        } catch (\Exception $e) {
            Log::error("Error al obtener datos de precios Zebra: {$e->getMessage()}");
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function FilterPartNum($categorySelected)
    {
        try {
            Log::info("los datos obtenidos son categorySelected:", ['categorySelected' => json_encode($categorySelected)]);
                // Si hay categorías seleccionadas, filtrar
                $categories = explode(',', $categorySelected);
                $results = [];

                foreach ($categories as $category) {
                    $results = array_merge($results, DB::connection('sqlsrv')->select(
                        "SELECT TOP (20700) [Part Number] AS [Part_Number] 
                        FROM [COTIZADOR].[dbo].['Catalogo Zebra Espanol'] 
                        WHERE [Product Sub Category] = ?", [$category]
                    ));
                }

            Log::info("los datos obtenidos son results:", ['results' => json_encode($results)]);

            // Verificar si no hay resultados
            if (empty($results)) {
                return response()->json([
                    'numberfilter' => [],
                    'message' => 'No se encontraron resultados para las categorías seleccionadas.',
                ], 200);
            }

            return response()->json([
                'numberfilter' => $results,
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

    public function FinalPrice(Request $request)
    {
        try{
            
            $selectedParts = $request->input('selectedParts');

            if (empty($selectedParts)) {
                return response()->json([
                    'totalPrice' => 0, // Mostrar con 2 decimales
                    'descuento'=>0,
                ], 200);
            }  

            $totalDiscount = 0;

            $totalPrice = 0;

            foreach ($selectedParts as $partNumber) {
                // Obtener el precio de lista para cada número de parte
                $price = DB::connection('sqlsrv')->select("SELECT [List Price] AS [List_Price] FROM [COTIZADOR].[dbo].['Catalogo Zebra Espanol'] WHERE [Part Number] = ?", [$partNumber]);
                
                // Si no se encuentra el número de parte, continuar con el siguiente
                if (empty($price)) {
                    continue;
                }
                $discountCode = DB::connection('sqlsrv')->select("SELECT [Discount Group] AS [Discount_Group] FROM [COTIZADOR].[dbo].['Catalogo Zebra Espanol'] WHERE [Part Number] = ?", [$partNumber]);
                $discountPercentage = DB::connection('sqlsrv')->select("SELECT [Recommended _Premier Solution Partner Discount] AS [per_Discount] FROM [COTIZADOR].[dbo].[Patametros_Descuetos_Zebra] WHERE [Discount Code] = ?", [$discountCode[0]->Discount_Group]);
                $valorVentaMeltec = $price[0]->List_Price -($price[0]->List_Price * $discountPercentage[0]->per_Discount);
                
                $aidc = DB::connection('sqlsrv')->select("SELECT [POCENTAJE OFERTA] AS [Porcentaje_Venta] FROM [COTIZADOR].[dbo].[A4_FLETE (Parametro)] WHERE [OFERTA VENTA] = 'AIDC'");
                
                $flete = DB::connection('sqlsrv')->select("SELECT [PORCENTAJE FLETE] AS [Porcentaje_Flete] FROM [COTIZADOR].[dbo].[A4_FLETE (Parametro)]");
                
                // Calcular el precio total con flete
                $finalPrice = $valorVentaMeltec * $flete[0]->Porcentaje_Flete / ($aidc[0]->Porcentaje_Venta-1)*(-1);
                $listPriceWithFlete = $price[0]->List_Price * $flete[0]->Porcentaje_Flete;
                $discount= 1-($finalPrice/$listPriceWithFlete);
                $discountInt= (number_format($discount, 2))*100;
                // Sumar el precio calculado al total
                
                $totalPrice += $finalPrice;
                $totalDiscount += $discountInt;
            }

            // Registrar el precio total calculado en los logs
            // Devolver el precio total calculado
            return response()->json([
                'totalPrice' => number_format($totalPrice, 2), // Mostrar con 2 decimales
                'descuento'=>$totalDiscount,
            ], 200);

        }catch(\Exception $e){
            // Registrar el error en el log
            Log::error("Error al calcular el precio de lista: {$e->getMessage()}");

            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function ImagenPart(Request $request)
    {
        try {
            $selectedParts = $request->input('selectedParts');
            $imagenpart = [];

            foreach ($selectedParts as $partNumber) {
                $result = DB::connection('sqlsrv')->select("SELECT [Image URL] AS [Image_URL] FROM [COTIZADOR].[dbo].['Catalogo Zebra Espanol'] WHERE [Part Number] = ?", [$partNumber]);
                if (!empty($result)) {
                    $imagenpart[] = $result[0]->Image_URL; // Agregar la URL al array
                }
            }

            // Verificar si no hay imágenes encontradas
            if (empty($imagenpart)) {
                return response()->json([
                    'imagenpart' => [],
                    'message' => 'No se encontraron imágenes para los números de parte seleccionados.',
                ], 200);
            }

            return response()->json([
                'imagenpart' => $imagenpart,
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error al obtener imágenes: {$e->getMessage()}");

            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function datosPartes(Request $request)
    {
        try{
            $selectedParts = $request->input('selectedParts');
        
            // Crear un array para almacenar los precios finales y descuentos
            $Partprice=[];
            $finalPriceDetails = [];
            $discountDetails = [];

            foreach ($selectedParts as $partNumber) {
                // Obtener el precio de lista
                // Obtener el precio de lista para cada número de parte
                $price = DB::connection('sqlsrv')->select("SELECT [List Price] AS [List_Price] FROM [COTIZADOR].[dbo].['Catalogo Zebra Espanol'] WHERE [Part Number] = ?", [$partNumber]);
                
                // Si no se encuentra el número de parte, continuar con el siguiente
                if (empty($price)) {
                    continue;
                }

                $flateX = DB::connection('sqlsrv')->select("SELECT [PORCENTAJE FLETE] AS [PORCENTAJE_FLETE] FROM [COTIZADOR].[dbo].[A4_FLETE (Parametro)]");

                $listPriceANDFlete = $price[0]-> List_Price * $flateX[0]-> PORCENTAJE_FLETE;


                $discountCode = DB::connection('sqlsrv')->select("SELECT [Discount Group] AS [Discount_Group] FROM [COTIZADOR].[dbo].['Catalogo Zebra Espanol'] WHERE [Part Number] = ?", [$partNumber]);
                $discountPercentage = DB::connection('sqlsrv')->select("SELECT [Recommended _Premier Solution Partner Discount] AS [per_Discount] FROM [COTIZADOR].[dbo].[Patametros_Descuetos_Zebra] WHERE [Discount Code] = ?", [$discountCode[0]->Discount_Group]);
                $valorVentaMeltec = $price[0]->List_Price -($price[0]->List_Price * $discountPercentage[0]->per_Discount);
                
                $aidc = DB::connection('sqlsrv')->select("SELECT [POCENTAJE OFERTA] AS [Porcentaje_Venta] FROM [COTIZADOR].[dbo].[A4_FLETE (Parametro)] WHERE [OFERTA VENTA] = 'AIDC'");
                
                $flete = DB::connection('sqlsrv')->select("SELECT [PORCENTAJE FLETE] AS [Porcentaje_Flete] FROM [COTIZADOR].[dbo].[A4_FLETE (Parametro)]");
                
                // Calcular el precio total con flete
                $finalPrice = $valorVentaMeltec * $flete[0]->Porcentaje_Flete / ($aidc[0]->Porcentaje_Venta-1)*(-1);
                $listPriceWithFlete = $price[0]->List_Price * $flete[0]->Porcentaje_Flete;
                $discount= 1-($finalPrice/$listPriceWithFlete);
                $discountInt= (number_format($discount, 2))*100;

                $Partprice[$partNumber] = number_format($listPriceANDFlete, 2);
                Log::info("los datos obtenidos son Partprice:", ['price' => json_encode($Partprice)]); 
                $finalPriceDetails[$partNumber] = number_format($finalPrice, 2);
                $discountDetails[$partNumber] = number_format($discountInt, 2);
            }

            return response()->json([
                'listPrice' => $Partprice,
                'totalPrice' => $finalPriceDetails, // Precios finales por parte
                'descuento' => $discountDetails, // Descuentos por parte
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error al obtener precios finales: {$e->getMessage()}");
    
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function porParte($parteBuscar)
    {
        try {
            Log::info("los datos obtenidos son parteBuscar:", ['parteBuscar' => json_encode($parteBuscar)]);
        
                $resultsx = DB::connection('sqlsrv')->select(
                "SELECT TOP (20700) [Part Number] FROM [COTIZADOR].[dbo].['Catalogo Zebra Espanol'] WHERE [Part Number] = ?", [$parteBuscar]);
            
            Log::info("los datos obtenidos son resultsx:", ['resultsx' => json_encode($resultsx)]);

            if (empty($resultsx)) {
                return response()->json([
                    'numberfilter' => [],
                    'message' => 'No se encontraron resultados para las categorías seleccionadas.',
                ], 200);
            }

            return response()->json([
                'numberfilter' => $resultsx,
            ], 200);
        } catch (\Exception $e) {
            Log::error("Error al filtrar números de parte: {$e->getMessage()}");

            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}
