<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class InformeSeguimientoController extends Controller
{
    public function index()
    {
        return Inertia::render('Informe_Seguimiento/Index');
    }
}