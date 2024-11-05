<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Api\CreateServerController;
use App\Http\Controllers\Api\EnviameController;
use App\Http\Controllers\Api\EpaycoController;
use App\Http\Controllers\Api\Sap\ClientsController;
use App\Http\Controllers\Api\Sap\OpportunitiesController;
use App\Http\Controllers\ServiceOrderController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    
});
// Ruta de Oportunidades
Route::get('/opportunities', [OpportunitiesController::class, 'index']);
Route::post('/opportunities', [OpportunitiesController::class, 'create']);
Route::post('/winOpportunity', [OpportunitiesController::class, 'win']);
Route::post('/loseOpportunity', [OpportunitiesController::class, 'lose']);
Route::post('/updatePhaseOpportunity', [OpportunitiesController::class, 'updatePhase']);

// Clientes SAP
Route::get('/clientsSap', [ClientsController::class, 'index']);

// ServiceOrder

Route::post('/serviceOrder1' , [ServiceOrderController::class, 'create']);
Route::post('/serviceOrder2' , [ServiceOrderController::class, 'post']);


Route::delete('/uploadFile', function (Request $request) {
    dd($request->all());
});

Route::post('/createServer', CreateServerController::class);
Route::post('/searchDelivery', [EnviameController::class, 'getDelivery']);