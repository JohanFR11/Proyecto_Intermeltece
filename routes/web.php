<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\HseqController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DirectorsController;
use App\Http\Controllers\Admin\RolsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ServerpartController;
use App\Http\Controllers\Admin\PartsController;
use App\Http\Controllers\Admin\KpiReportsController;
use App\Http\Controllers\Auth\NotificationController;
use App\Http\Controllers\MarkReadNotificationController;
use App\Http\Controllers\Functions\UploadFilesController;
use App\Http\Controllers\Pdf\QuoteServerReportController;
use App\Http\Controllers\View\CommercialQuoterController;
use App\Http\Controllers\Admin\PermissionsStoreController;
use App\Http\Controllers\Api\EpaycoController;
use App\Http\Controllers\Api\Sap\MasterDataController;
use App\Http\Controllers\Auth\PersonalAccessTokensController;
use App\Http\Controllers\HomeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
    ]);
});

Route::get('/sigue-tus-envios', function () {
    return Inertia::render('Envios/Index', [
        'canLogin' => Route::has('login'),
    ]);
})->name('shipments');

Route::get('/formulario-de-pagos', function() {
    return Inertia::render('Payments/FormPayment');
})->name('payments.form');

Route::middleware('auth')->group(function () {

    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');
    
    Route::get('/salesToday', [MasterDataController::class, 'salesToday'])->name('masterdata.salestoday');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/directors', DirectorsController::class)->name('directors.index');

    Route::resource('users', UserController::class)->names('admin.users');
    Route::resource('parts', ServerpartController::class)->names('admin.parts');
    Route::resource('rols', RolsController::class)->names('admin.rols');
    Route::get('/roles-permissions/{id}', [RolsController::class, 'getPermissionsByRoleId'])->name('admin.rols.getPermissions');

    Route::post('newPermissions', PermissionsStoreController::class)->name('admin.permission.create');

    Route::get('/notifications', NotificationController::class)->name('notifications');
    Route::get('/markNotifications/{id}', MarkReadNotificationController::class)->name('markNotifications');

    Route::get('/quoteserver/{id}', QuoteServerReportController::class)->name('quoteserver.report');

    Route::resource('generatetokens', PersonalAccessTokensController::class)->names('profile.generatetokens');

    Route::get('/commercial', CommercialQuoterController::class)->name('commercial.quoter');

    Route::get('hseq', [HseqController::class, 'index'])->name('resources.hseq.index');
    Route::post('hseq', [HseqController::class, 'store'])->name('resources.hseq.store');
    Route::get('/hseq/{id}', [HseqController::class, 'download'])->name('resources.hseq.download');
    Route::delete('/hseq/delete/{id}', [HseqController::class, 'destroy'])->name('resources.hseq.destroy');

    Route::post('/uploadFile', UploadFilesController::class);

    Route::get('/kpis', [KpiReportsController::class, 'index'])->name('kpi.reports.index');
    Route::post('/kpis', [KpiReportsController::class, 'store'])->name('kpi.reports.store');
    Route::get('/kpis/{kpi}', [KpiReportsController::class, 'show'])->name('kpi.reports.show');
    Route::delete('/kpis/delete/{kpi}',[KpiReportsController::class, 'destroy'])->name('kpi.reports.destroy');

    Route::post('/revokePermission', [UserController::class, 'revokePermission'])->name('api.permission.revoke');
    Route::post('/storePermission', [UserController::class, 'storePermission'])->name('api.permission.sync');

    Route::get('/partsedit', [PartsController::class, 'index'])->name('admin.partsedit.index');
    Route::put('/partsedit/{id}', [PartsController::class, 'update'])->name('admin.partsedit.update');

    Route::get('/products', function () {
        return Inertia::render('Products/Index');
    })->name('products.index');

    Route::get('/epayco-payments', [EpaycoController::class, 'index'])->name('payments.index');
    Route::post('/transactions-epayco', [EpaycoController::class, 'getTransactions']);
    Route::get('/transactions-epayco/{id}', [EpaycoController::class, 'getTransactionsById'])->name('payment.details');
});

require __DIR__ . '/auth.php';
