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
            $partNumsData=DB::connection('mysql')->select("SELECT Part_Number FROM catalogo_zebra_espanol");
            $madata =DB::connection('mysql')->select("SELECT * FROM mesa_ayuda_aidc");
            $categorias =DB::connection('mysql')->select("SELECT DISTINCT categoria_producto FROM mesa_ayuda_aidc");

           /*$CREDENTIALS = [
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
            }*/

            // Verificar si los datos están vacíos
            if (empty($data)) {
                return Inertia::render('Commercial/Zebra/Index', [
                    'data' => [],
                    'partNumData'=>[],
                    /*'odataClientes' => [],*/
                    'MAData' =>[],
                    'CategoriasMA'=>[]
                ]);
            }
            
            // Si hay datos, renderiza la vista de React y pasa los datos
            return Inertia::render('Commercial/Zebra/Index', [
                'data' => $data,
                'partNumData'=>$partNumsData,
                /*'odataClientes' => $odata['d']['results'] ?? [],*/
                'MAData' =>$madata,
                'CategoriasMA'=>$categorias,
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
            
            if (empty($categorySelected)|| $categorySelected==0) {

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
                $totalDiscount = $discountInt;
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

    public function DescPart(Request $request)
    {
        try {
            $selectedParts = $request->input('selectedParts');
            $Img ='' ;
            $Desc='';
            foreach ($selectedParts as $partNumber) {
                $result = DB::connection('mysql')->select("SELECT Image_URL, Short_Marketing_Desc FROM catalogo_zebra_espanol WHERE Part_Number = ?", [$partNumber]);
                if (!empty($result)) {
                    $Img = $result[0]->Image_URL;
                    $Desc= $result[0]->Short_Marketing_Desc;
                }
            }
            // Verificar si no hay imágenes encontradas
            if (empty($Img)) {
                return response()->json([
                    'imagen' => [],
                    'message' => 'No se encontraron imágenes para los números de parte seleccionados.',
                ], 200);
            }
            return response()->json([
                'imagen' => $Img,
                'Desc'=>$Desc
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
            $datainfo=[];

            foreach ($selectedParts as $partNumber) {
                // Obtener el precio de lista
                // Obtener el precio de lista para cada número de parte
                $price = DB::connection('mysql')->select("SELECT List_Price FROM catalogo_zebra_espanol WHERE Part_Number = ?", [$partNumber]);
                $info = DB::connection('mysql')->select("SELECT * FROM catalogo_zebra_espanol WHERE Part_Number = ?", [$partNumber]);
                
                // Si no se encuentra el número de parte, continuar con el siguiente
                if (empty($price)) {
                    continue;
                }

                $flateX = DB::connection('mysql')->select("SELECT Porcentaje_Flete FROM a4_flete");

                $listPriceANDFlete = $price[0]-> List_Price * $flateX[0]-> Porcentaje_Flete;


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

                $Partprice[$partNumber] = number_format($listPriceANDFlete, 2);
                $finalPriceDetails[$partNumber] = number_format($finalPrice, 2);
                $discountDetails[$partNumber] = number_format($discountInt, 2);
                $datainfo[$partNumber]=$info;
                Log::info("informacion obtenida: ", $datainfo);
            }

            return response()->json([
                'listPrice' => $Partprice,
                'totalPrice' => $finalPriceDetails, // Precios finales por parte
                'descuento' => $discountDetails,
                'dataInfo' => $datainfo
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error al obtener precios finales: {$e->getMessage()}");
    
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    public function InputSearch(Request $request)
    {
        Log::info("Solicitud recibida en InputSearch");

        try{

            Log::info("Datos recibidos en el request: ", $request->all());
            $input = $request->input('selectedParts');
            Log::info("Esto es lo que se recibe como selectedParts: {$input}");
            if (empty($input)|| $input==null) {

                $PartNums = DB::connection('mysql')->select("SELECT Part_Number FROM catalogo_zebra_espanol");
                return response()->json([
                    'partNums' => $PartNums
                ], 200);
            }
            
            $PartNums = DB::connection('mysql')->select("
                SELECT Part_Number FROM catalogo_zebra_espanol 
                WHERE Part_Number LIKE ?
            ", ["%$input%"]);        

            Log::info("Resultados de la búsqueda: ", $PartNums);

            if (empty($PartNums)) {
                return response()->json([
                    'partNums' => [],
                    'message' => 'No se encontro el numero de busqueda.',
                ], 200);
            }
    
            // Devolver los resultados en formato JSON
            return response()->json([
                'partNums' => $PartNums,
            ], 200);
        } catch (\Exception $e) {
            // Log del error para debugging
            Log::error("Error al buscar el numero de busqueda: {$e->getMessage()}");
    
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

}