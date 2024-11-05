<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class EnviameController extends Controller
{
    public function getDelivery(Request $request)
    {
        try {
            $idEnvio = $request->input('data');
            $response = Http::withHeaders([
                'Accept' => 'application/json',
                'api-key' => env('API_TOKEN'),
                'Content-Type' => 'application/json',
            ])->get(env('URL_API') . 's2/v2/deliveries/' . $idEnvio);

            if ($response->status() !== 200) {
                throw new Exception($response->getReasonPhrase(), $response->status());
            }

            return response()->json(json_decode($response->body()), 200);

            dd($response);
        } catch (Exception $th) {
            return response()->json([
                'message' => $th->getMessage(),
                'code' => $th->getCode(),
            ], $th->getCode());
        }
    }
}
