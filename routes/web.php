<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Middleware\MoodleAuthMiddleware;
use App\Http\Controllers\HseqController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DirectorsController;
use App\Http\Controllers\Admin\RolsController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\ServerpartController;
use App\Http\Controllers\Admin\PartsController;
use App\Http\Controllers\Admin\KpiReportsController;
use App\Http\Controllers\Auth\NotificationController;
use App\Http\Controllers\Auth\GoogleAuthenticationController;
use App\Http\Controllers\MarkReadNotificationController;
use App\Http\Controllers\Functions\UploadFilesController;
use App\Http\Controllers\Pdf\QuoteServerReportController;
use App\Http\Controllers\View\CommercialQuoterController;
use App\Http\Controllers\Admin\PermissionsStoreController;
use App\Http\Controllers\Api\EpaycoController;
use App\Http\Controllers\Api\Sap\MasterDataController;
use App\Http\Controllers\Auth\PersonalAccessTokensController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PreciosUlefoneController;
use App\Http\Controllers\CotizadorZebraController;
use App\Http\Controllers\GoogleDriveController;
use App\Http\Controllers\ModuloAprendizajeController;
use App\Http\Controllers\MoodleController;
use App\Http\Controllers\MoodleAuthController;

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

    Route::middleware('auth')->get('/user', function() {
        $user = Auth::user();  // Utiliza el método Auth::user() para obtener el usuario autenticado
    
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $user->avatar,
        ]);
    });

    Route::get('/dashboard', [HomeController::class, 'index'])->name('dashboard');
    
    Route::get('/auditoria', function () {
        return Inertia::render('Auditorias/Index');
    })->name('auditoria');
    Route::get('/exchange-token', [GoogleDriveController::class, 'exchangeCodeForToken']);
    Route::post('/refresh-token', [GoogleDriveController::class, 'refreshAccessToken']);
    Route::post('/remove-token', [GoogleDriveController::class, 'revokeAuthorization']);
    Route::post('/upload-file', [GoogleDriveController::class, 'uploadFile']);
    Route::post('/list-files', [GoogleDriveController::class, 'listFiles']);
    
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
    Route::get('/commercial/ulefone', [PreciosUlefoneController::class, 'index'])->name('ulefone.index');
    Route::get('/commercial/zebra', [CotizadorZebraController::class, 'index'])->name('zebra.index');    
    Route::get('/commercial/zebra/{categorySelected}', [CotizadorZebraController::class, 'FilterPartNum'])->name('zebra.filter.partnum');
    Route::post('/commercial/zebra/price', [CotizadorZebraController::class, 'PrecioLista'])->name('zebra.listprice');
    Route::post('/commercial/zebra/finalprice', [CotizadorZebraController::class, 'FinalPrice'])->name('zebra.finalprice');
    Route::post('/commercial/zebra/desc', [CotizadorZebraController::class, 'DescPart'])->name('zebra.desc');
    Route::post('/commercial/zebra/datospartes', [CotizadorZebraController::class, 'datosPartes'])->name('zebra.datospartes');
    Route::post('/commercial/zebra/search', [CotizadorZebraController::class, 'InputSearch'])->name('zebra.search');

    Route::get('hseq', [HseqController::class, 'index'])->name('resources.hseq.index');
    Route::post('hseq', [HseqController::class, 'store'])->name('resources.hseq.store');
    Route::get('/hseq/{id}', [HseqController::class, 'download'])->name('resources.hseq.download');
    Route::delete('/hseq/delete/{id}', [HseqController::class, 'destroy'])->name('resources.hseq.destroy');
    Route::get('/hseq/filter/{folder_id}', [HseqController::class, 'filterDocuments'])->name('resources.hseq.filter');
    Route::post('hseq/CreateFolder', [HseqController::class, 'CreateFolder'])->name('resources.hseq.create');
    Route::get('/hseq/preview/{id}', [HseqController::class, 'previewFileUrl'])->name('resources.hseq.filepreview');
    
    /* Modulos de prendizaje */
    Route::get('/modulo', [ModuloAprendizajeController::class, 'logIn'])->name('resources.modulo.login');
    Route::get('/modulo/register', [ModuloAprendizajeController::class, 'register'])->name('resources.modulo.register');
    Route::middleware([MoodleAuthMiddleware::class])->group(function () {
        Route::get('/modulo/index', [ModuloAprendizajeController::class, 'index'])->name('resources.modulo.index');
        // Route::get('/{any}', function () {
        //     return redirect()->route('resources.modulo.index');
        // })->where('any', '.*');
    
        /* Backend moodle authenticated */
        Route::get('/moodle/user/{userid}', [MoodleController::class, 'getUserInfo'])->name('moodle.get.user.info');
        Route::get('/moodle/cursos_disponibles/{userid}', [MoodleController::class, 'getUserCourses'])->name('moodle.get.courses');
        Route::get('/moodle/cursos/{courseid}', [MoodleController::class, 'getUserContent'])->name('moodle.get.content');
        Route::get('/moodle/cursos/contenido/{courseid}', [MoodleController::class, 'getPagesContent'])->name('moodle.get.pages.content');
        Route::get('/moodle/cursos/contenido/asignaciones/{courseid}', [MoodleController::class, 'getAssignContent'])->name('moodle.get.courses.assign');
        Route::get('/moodle/quiz/{courseid}', [MoodleController::class, 'getQuizInfo'])->name('moodle.get.quiz.info');
        Route::get('/moodle/quiz/data/{attemptid}', [MoodleController::class, 'getQuizContent'])->name('moodle.get.quiz.content');
        Route::get('/moodle/quiz/attempt/{quizid}', [MoodleController::class, 'startQuizAttempt'])->name('moodle.start.quiz.attp');
    });
    // Rutas backend moodle
    Route::post('/moodle/login', [MoodleAuthController::class, 'login']); 
    Route::post('/moodle/register', [MoodleAuthController::class, 'register']); 

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
