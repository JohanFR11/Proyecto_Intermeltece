<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ModuloAprendizaje extends Controller
{
    public function index()
    {
        return Inertia::render('Modulo_Aprendizaje/Index');
    }
}