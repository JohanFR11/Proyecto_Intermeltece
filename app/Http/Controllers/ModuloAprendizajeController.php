<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

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

    public function index(Request $request)
    {
        Session::put('userMoodle', $request->get('userMoodle'));
            Session::save();
        return Inertia::render('Aprendizaje/Index', [
            'userMoodle' => $request->get('userMoodle'),
            'token' => Session::get('moodle_token'),
        ]);
    }

    public function contenido(Request $request,$id)
    {
        return Inertia::render('Aprendizaje/Components/ObtenerContenidoCursos',[
            'courseid' => $id,
            'userid' => $request->get('userid'),
            'token' => Session::get('moodle_token'),
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
                'moduleid'=>$request->moduleid,
                'token'=>$request->token,
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
                'moduleid'=>$request->moduleid,
                'token'=>$request->token,
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