<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ModuloAprendizajeController extends Controller
{
    public function index()
    {
        return Inertia::render('Aprendizaje/Index');
    }

    /* Funcion para renderizar el modulo de capacitaciones */
    public function capacitaciones()
    {
        return Inertia::render('Aprendizaje/Fragments/Capacitaciones');
    }
}