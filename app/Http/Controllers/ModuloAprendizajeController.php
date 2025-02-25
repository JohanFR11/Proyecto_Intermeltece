<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ModuloAprendizajeController extends Controller
{
    public function logIn()
    {
        return Inertia::render('Aprendizaje/Components/LoginMoodle');
    }

    public function register()
    {
        return Inertia::render('Aprendizaje/Components/RegisterMoodle');
    }

    public function index()
    {
        return Inertia::render('Aprendizaje/Index');
    }

}