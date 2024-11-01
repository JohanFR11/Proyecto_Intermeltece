<?php

namespace App\Http\Controllers\Api\Sap;

use Exception;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Process;

class ClientsController extends Controller
{
    private $nodeOpportunityPath;

    public function __construct()
    {
        $this->nodeOpportunityPath = base_path() . '/sap/functions/clients/';
    }

    public function index(Request $request)
    {
        $parameters = json_encode($request->query());
        return ($this->executeScript('/Get/app.js', 'node', $parameters));
    }

    private function executeScript(String $script, String $type, ?String $params = '')
    {
        try {
            $scriptPath = "$this->nodeOpportunityPath$script '$params'";
            $command = "$type $scriptPath";
            $result = Process::run($command)->throw();
            $jsonData = json_decode($result->output(), true);
            // $code = $jsonData['code'];
            return response()->json($jsonData);
        } catch (Exception $e) {
            return response()->json(['ScriptMessage' => $e->getMessage()], 500);
        }
    }
}
