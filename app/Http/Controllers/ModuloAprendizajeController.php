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

    public function contenido($id)
    {
        return Inertia::render('Aprendizaje/Components/ObtenerContenidoCursos',[
            'courseid' => $id
        ]);
    }

    public function obtenerContenidoPaginas(Request $request)
    {
        $request->validate([
            'courseid' => 'required|int',
            'moduleid'=> 'required|int'
        ]);

        return Inertia::render('Aprendizaje/Components/ObtenerPaginas',
            [
                'courseid' => $request->courseid,
                'moduleid'=>$request->moduleid
            ]
        );
    }

    public function obtenerContenidoAsignaciones(Request $request)
    {
        $request->validate([
            'courseid' => 'required|int',
            'moduleid'=> 'required|int'
        ]);

        return Inertia::render('Aprendizaje/Components/ObtenerAsignaciones',
            [
                'courseid' => $request->courseid,
                'moduleid'=>$request->moduleid
            ]
        );
    }

    public function obtenerContenidoQuiz(Request $request)
    {
        $request->validate([
            'courseid' => 'required|int',
            'moduleid'=> 'required|int'
        ]);

        return Inertia::render('Aprendizaje/Components/ObtenerQuiz',
            [
                'courseid' => $request->courseid,
                'moduleid'=>$request->moduleid
            ]
        );
    }

}