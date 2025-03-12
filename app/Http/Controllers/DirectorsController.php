<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class DirectorsController extends Controller
{
    public function __invoke()
    {
        if(!Gate::allows('kpisDirectorAccess')) {
            abort(401, 'No estas Autorizado para entrar a este recurso, comunicate con IT para solicitar Acceso');
        }
        return Inertia::render('Directors/Index');
    }
}
