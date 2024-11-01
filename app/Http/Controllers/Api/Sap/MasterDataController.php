<?php

/**
 * Api de Integracion SAP ByDesign con plataforma de desarrollo propio Meltec Comunicaciones S.A
 * Codigo de uso privado, utilizacion solo autorizada por Meltec Comunicaciones S.A
 * 
 * @author Nicolas Cuadros <jcuadros@meltec.com.co>
 * @version 1.5
 */

namespace App\Http\Controllers\Api\Sap;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Lang;
use Illuminate\Support\Facades\Log;

class MasterDataController extends Controller
{
    /**
     * Indica la Url de SAP
     *
     * @var string
     */
    private $sapUrl;
    /**
     * Formato de los datos
     *
     * @var string
     */
    private $format;
    /**
     * Fecha Actual
     *
     * @var string
     */
    private $today;
    /**
     * Usuario Autorizado de SAP
     *
     * @var string
     */
    private $username;
    /**
     * Contraseña de Usuario
     *
     * @var string
     */
    private $password;

    public function __construct()
    {
        $this->sapUrl = env('SAP_URL_PRODUCCTION');
        $this->format = 'json';
        $this->today = "date('Y-m-d')T00:00:00";
        $this->username = env('SAP_USERNAME_PRODUCTION');
        $this->password = env('SAP_PASSWORD_PRODUCTION');
    }
    
    /**
     * Obtener las ventas obtenidas a la fecha de hoy durante la valides del KPI
     *
     * @return JsonResponse
     */
    public function salesToday() : JsonResponse
    {
        try {
            $kpiUrl = $this->sapUrl . "sap/byd/odata/analytics/kpi/Kpi.svc/Kpi('Z06B490E4B983CB96DD195ADF')/Value?\$format=$this->format";

            $jsonData = $this->httpRequest($kpiUrl);

            if (!$jsonData) {
                throw new Exception(Lang::get('Error getting data from SAP'));
            }

            return response()->json($jsonData->d->results, 200);

        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Helper function para el consumo de la odata de SAP
     *
     * @param String $urlRequest
     * @return mixed
     */
    private function httpRequest(String $urlRequest): mixed
    {
        try {
            $httpRequest = Http::withBasicAuth($this->username, $this->password)->get($urlRequest);
            $response = $httpRequest->body();
            $jsonTransform = json_decode($response);

            return $jsonTransform;
        } catch (Exception $e) {
            Log::error(Lang::get('SAP HTTP Request Error') . $e->getMessage());

            throw new Exception($e->getMessage());

            return null;
        }
    }
}
