<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Lang;
use Inertia\Inertia;

define('URL', env('APIFY_URL'));

class EpaycoController extends Controller
{

    public function index()
    {
        if(!Gate::allows('paymentDetails')) {
            abort(403, Lang::get('You are not authorized to access this resource, please contact IT to request access'));
        }

        try {
            $responseWithJWTEpayco = Http::withBasicAuth(env('EMAIL_EPAYCO'), env('PASSWORD_EPAYCO'))->post(URL . '/login/mail', [
                'Content-Type' => 'application/json',
            ]);

            $jsonToken = json_decode($responseWithJWTEpayco->body(), true);

            if (!$jsonToken || isset($jsonToken['error'])) {
                throw new Exception(Lang::get('Error getting the Access Token'), 500);
            }

            return Inertia::render('Payments/Index', [
                'token' => $jsonToken['token']
            ]);
        } catch (Exception $e) {
            return Inertia::render('Payments/Index', [
                'token' => '',
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function getTransactions(Request $request)
    {

        $token = $request->input('token');

        try {
            $transacctionsEpayco =  Http::withHeaders([
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $token,
            ])
                ->get(URL . '/transaction', [
                    'filter' => [
                        'transactionInitialDate' => '2023-01-01 00:00:00',
                        'transactionEndDate' => '2023-12-31 23:59:59',
                    ],
                    'pagination' => [
                        'page' => 2
                    ]
                ]);

            if (!$transacctionsEpayco) {
                throw new Exception('Error al obtener los datos de las transacciones', 500);
            }

            $data = json_decode($transacctionsEpayco->body());

            return response()->json([
                'transactions' => $data->data->data,
                'pagination' => $data->data->pagination
            ], 200);
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function getTransactionsById(Request $request, String $id)
    {
        try {
            $reference = $id;
            $token = $request->header('Authorization');

            $transactionDetail = Http::withBody(json_encode([
                'filter' => [
                    'referencePayco' => $reference
                ]
            ]), 'application/json')->withToken($token)->get(URL . '/transaction/detail');

            if(!$transactionDetail) {
                throw new Exception(Lang::get('Error getting transaction data'), 500);
            }

            $transaction = json_decode($transactionDetail->body());

            return response()->json([
                'transaction' => $transaction->data
            ], 200);
            
        } catch (Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
