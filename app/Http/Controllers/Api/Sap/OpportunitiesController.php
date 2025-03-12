<?php

/**
 * API de integracion SAP ByDesing con Plataforma BPM Flokzu para la creacion de oportunidades 
 * Codigo de uso privado, utilizacion solo autorizada por Meltec Comunicaciones S.A
 * 
 * @author Nicolas Cuadros <jcuadros@meltec.com.co>
 * @version 1.0.0
 */

namespace App\Http\Controllers\Api\Sap;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Lang;

class OpportunitiesController extends Controller
{

    /**
     * Ubicacion del proceso de SAP 
     *
     * @var String
     */
    private $nodeOpportunityPath;

    /**
     * Solo se encuentra la ubicacion de la funcion JS para la oportunidad
     */
    public function __construct()
    {
        $this->nodeOpportunityPath = base_path() . '/sap/functions/opportunities/';
    }

    /**
     * Obtener todas las oportunidades desde SAP
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        return $this->executeScript('/Get/app.js', 'node');
    }

    /**
     * Creacion de una nueva Oportunidad desde Flokzu a SAP
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        $dataSend = json_encode($request->all());
        $proccess = $this->executeScript('Post/postOpportunity.js', 'node', $dataSend);
        return $proccess;
    }

    /**
     * Actualizacion de la oportunidad a Ganada
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function win(Request $request): JsonResponse
    {
        $opportunity = json_encode($request->all());
        $dataRecibe =  $this->executeScript('Post/winOpportunity.js', 'node', $opportunity);
        if ($dataRecibe->getStatusCode() === 400) {
            return response()->json(['ErrorCodeMessage' => json_encode($dataRecibe->getData()->message)], 400);
        }

        if(!$dataRecibe->getData()->result->OpportunityWin) {
            return response()->json(['ErrorFalseOpportunity' => Lang::get('Failure to Win the Opportunity')], 400);
        }
        $secondProccess = Process::run('node '.base_path()."/sap/functions/opportunities/Patch/updateSalesPhaseCodeOpp.js '$opportunity'")->throw();

        $result = json_decode($secondProccess->output());
        $code = $result->code;
        
        return response()->json($result, $code);
    }

    /**
     * Actualizacion de la oportunidad a Perdida
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function lose(Request $request): JsonResponse
    {
        $opportunity = json_encode($request->all());
        $dataRecibe = $this->executeScript('Post/loseOpportunity.js', 'node', $opportunity);

        if ($dataRecibe->getStatusCode() === 400) {
            return response()->json(['ErrorCodeMessage' => json_encode($dataRecibe->getData()->message)], 400);
        }

        if(!$dataRecibe->getData()->result->OpportunityLose) {
            return response()->json(['ErrorFalseOpportunity' => Lang::get('Failure to Win the Opportunity')], 400);
        }
        $secondProccess = Process::run('node '.base_path()."/sap/functions/opportunities/Patch/updateSalesPhaseCodeOpp.js '$opportunity'")->throw();

        $result = json_decode($secondProccess->output());
        $code = $result->code;
        return response()->json($result, $code);
    }

    /**
     * Actualizacion de las fases de la Oportunidad
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updatePhase (Request $request) : JsonResponse
    {
        $opportunity = json_encode($request->all());
        $secondProccess = Process::run('node '.base_path()."/sap/functions/opportunities/Patch/updateSalesPhaseCodeOpp.js '$opportunity'")->throw();

        $result = json_decode($secondProccess->output());
        $code = $result->code;
        return response()->json($result, $code);
    }

    /**
     * Funcion Helper para la inicializacion del proceso
     *
     * @param String $script
     * @param String $type
     * @param String|null $params
     * @return JsonResponse
     */
    private function executeScript(String $script, String $type, ?String $params = ''): JsonResponse
    {
        try {
            $scriptPath = "$this->nodeOpportunityPath$script '$params'";
            $command = "$type $scriptPath";
            $result = Process::run($command)->throw();
            $jsonData = json_decode($result->output());
            $code = $jsonData->code;
            return response()->json($jsonData, $code);
        } catch (Exception $e) {
            return response()->json(['ScriptMessage' => $e->getMessage()], 500);
        }
    }
}
