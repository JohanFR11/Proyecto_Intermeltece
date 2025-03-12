<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Process;

// use Symfony\Component\Process\Process;
// use Symfony\Component\Process\Exception\ProcessFailedException;

class TestApiController extends Controller
{   
    public function index(Request $request)
    {
        $scriptFile = base_path(). '/sap/functions/opportunities/Get/app.js ';
        $command = "node $scriptFile";
        $result = Process::run($command)->throw();
        $data = json_decode($result->output());

        return response()->json($data);
    }
}