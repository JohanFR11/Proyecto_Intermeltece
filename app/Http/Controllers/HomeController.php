<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class HomeController extends Controller
{
    public function index() 
{
    try {

            date_default_timezone_set('America/Bogota');


            /* Consulta para la MetaODataRanking */

            $OdataMeta = DB::select('SELECT SUM(valor_net) AS total FROM ranking;');

            /* Consulta, agrupamiento y suma del Ranking de Ventas */

            $hoy = date('Y-m-d\T00:00:00');

            $OdataRanking = DB::select('SELECT * FROM ranking WHERE fecha = ?', [$hoy]);


            $SumaVentasHoy = DB::select('SELECT SUM(valor_net) AS totalVentas FROM ranking WHERE fecha = ?',[$hoy]);


        return Inertia::render('Dashboard', [
            'OdataRanking' => $OdataRanking,
            'TotalVentasHoy'=> $SumaVentasHoy,
            'OdataMeta' => $OdataMeta, 
        ]);

    } catch (\Exception $e) {
        // Manejar excepciones
        Log::error("Error al obtener datos de meta {$e->getMessage()}");
        return response()->json(['error' => $e->getMessage()], 500);
    }
}


    public function cumpleanos()
    {
        return Inertia::render('HomeIntranet/Fragments/ModuloCumpleanos');
    }
    public function articulos()
    {
        return Inertia::render('HomeIntranet/Fragments/ModuloArticulos');
    }

    public function dataHappyBirthday()
    {
        try {

            $Users = DB::select("SELECT * FROM cumple_ani");

            return response()->json(['users' => $Users]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error en la peticon de la tabla cumpleaños: ' . $e->getMessage()], 500);
        }
    }
}
