<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class MoodleController extends Controller
{

    private const moodleUrl='http://127.0.0.1/moodle/webservice/rest/server.php';
    private $token;

    public function __construct()
    {

        $this->middleware(function ($request, $next) {
            $this->token = Session::get('moodle_token');
            return $next($request);
        });
    }    

    public function getUserInfo($userid)
    {
        $function = "core_user_get_users_by_field";

        $client = new Client();

        try {
            // Hacer la petición a Moodle
            $response = $client->request('GET', self::moodleUrl, [
                'query' => [
                    'wstoken' => $this->token,
                    'wsfunction' => $function,
                    'moodlewsrestformat' => 'json',
                    'field' => 'id',
                    'values[0]' => $userid,
                ]
            ]);

            // Obtener el cuerpo de la respuesta
            $body = $response->getBody();
            $user = json_decode($body, true);

            // Retornar los datos como JSON
            return response()->json($user);

        } catch (\Exception $e) {
            // Manejo de errores
            return response()->json(['error' => 'No se pudieron obtener datos del usuario', 'message' => $e->getMessage()], 500);
        }
    }

    public function getUserCourses($userid)
    {
        $function = "core_enrol_get_users_courses";
        

        $client = new Client();

        try {
            // Hacer la petición a Moodle
            $response = $client->request('GET', self::moodleUrl, [
                'query' => [
                    'wstoken' => $this->token,
                    'wsfunction' => $function,
                    'moodlewsrestformat' => 'json',
                    'userid' => $userid
                ]
            ]);

            // Obtener el cuerpo de la respuesta
            $body = $response->getBody();
            $courses = json_decode($body, true);

            // Retornar los datos como JSON
            return response()->json($courses);

        } catch (\Exception $e) {
            // Manejo de errores
            return response()->json(['error' => 'No se pudieron obtener los cursos', 'message' => $e->getMessage()], 500);
        }


    }
    /**
     * Obtener los cursos de un usuario
     */
    public function getUserContent($courseid)
    {   
        $function = "core_course_get_contents";
        

        $client = new Client();

        try {
            // Hacer la petición a Moodle
            $response = $client->request('GET', self::moodleUrl, [
                'query' => [
                    'wstoken' => $this->token,
                    'wsfunction' => $function,
                    'moodlewsrestformat' => 'json',
                    'courseid' => $courseid
                ]
            ]);

            // Obtener el cuerpo de la respuesta
            $body = $response->getBody();
            $courses = json_decode($body, true);

            // Retornar los datos como JSON
            return response()->json($courses);

        } catch (\Exception $e) {
            // Manejo de errores
            return response()->json(['error' => 'No se pudieron obtener los cursos', 'message' => $e->getMessage()], 500);
        }
    }

    public function getPagesContent($courseid)
    {   
        $function = "mod_page_get_pages_by_courses";
        

        $client = new Client();

        try {
            // Hacer la petición a Moodle
            $response = $client->request('GET', self::moodleUrl, [
                'query' => [
                    'wstoken' => $this->token,
                    'wsfunction' => $function,
                    'moodlewsrestformat' => 'json',
                    'courseids[0]' => $courseid
                ]
            ]);

            // Obtener el cuerpo de la respuesta
            $body = $response->getBody();
            $courses = json_decode($body, true);

            // Retornar los datos como JSON
            return response()->json($courses);

        } catch (\Exception $e) {
            // Manejo de errores
            return response()->json(['error' => 'No se pudieron obtener los cursos', 'message' => $e->getMessage()], 500);
        }
    }

    public function getAssignContent($courseid)
    {   
        $function = "mod_assign_get_assignments";
        

        $client = new Client();

        try {
            // Hacer la petición a Moodle
            $response = $client->request('GET', self::moodleUrl, [
                'query' => [
                    'wstoken' => $this->token,
                    'wsfunction' => $function,
                    'moodlewsrestformat' => 'json',
                    'courseids[0]' => $courseid
                ]
            ]);

            // Obtener el cuerpo de la respuesta
            $body = $response->getBody();
            $courses = json_decode($body, true);

            // Retornar los datos como JSON
            return response()->json($courses);

        } catch (\Exception $e) {
            // Manejo de errores
            return response()->json(['error' => 'No se pudieron obtener los cursos', 'message' => $e->getMessage()], 500);
        }
    }

    //QUIZ SECTION

    public function getQuizInfo($courseid)
    {

        $function = "mod_quiz_get_quizzes_by_courses";
        

        $client = new Client();

        try {
            // Hacer la petición a Moodle
            $response = $client->request('GET', self::moodleUrl, [
                'query' => [
                    'wstoken' => $this->token,
                    'wsfunction' => $function,
                    'moodlewsrestformat' => 'json',
                    'courseids[0]' => $courseid
                ]
            ]);

            $body = $response->getBody();
            $quizzes = json_decode($body, true);

            // Retornar los datos como JSON
            return response()->json($quizzes);

        } catch (\Exception $e) {
            // Manejo de errores
            return response()->json(['error' => 'No se pudieron obtener los cursos', 'message' => $e->getMessage()], 500);
        }
    }

    public function startQuizAttempt($quizid)
    {
        $function = "mod_quiz_start_attempt";
        

        $client = new Client();

        try {
            // Hacer la petición a Moodle
            $response = $client->request('GET', self::moodleUrl, [
                'query' => [
                    'wstoken' => $this->token,
                    'wsfunction' => $function,
                    'moodlewsrestformat' => 'json',
                    'quizid' => $quizid
                ]
            ]);

            $body = $response->getBody();
            $content = json_decode($body, true);

            // Retornar los datos como JSON
            return response()->json($content);

        } catch (\Exception $e) {
            // Manejo de errores
            return response()->json(['error' => 'No se pudieron obtener los cursos', 'message' => $e->getMessage()], 500);
        }
    }

    public function getQuizContent ($attemptid)
    {
        $function = "mod_quiz_get_attempt_data";
        

        $client = new Client();

        try {
            // Hacer la petición a Moodle
            $response = $client->request('GET', self::moodleUrl, [
                'query' => [
                    'wstoken' => $this->token,
                    'wsfunction' => $function,
                    'moodlewsrestformat' => 'json',
                    'attemptid' => $attemptid,
                    'page' => 0
                ]
            ]);
            $body = $response->getBody();
            $content = json_decode($body, true);

            // Retornar los datos como JSON
            return response()->json($content);
            
        } catch (\Exception $e) {
            // Manejo de errores
            return response()->json(['error' => 'No se pudieron obtener los cursos', 'message' => $e->getMessage()], 500);
        }
    }

    public function postContent (Request $request)
    {
        $function = "mod_quiz_process_attempt";
        
        $attemptid=$request->

        $client = new Client();

        try {
            // Hacer la petición a Moodle
            $response = $client->request('GET', self::moodleUrl, [
                'query' => [
                    'wstoken' => $this->token,
                    'wsfunction' => $function,
                    'moodlewsrestformat' => 'json',
                    'attemptid' => $attemptid,
                    'page' => 0
                ]
            ]);
            $body = $response->getBody();
            $content = json_decode($body, true);

            // Retornar los datos como JSON
            return response()->json($content);
            
        } catch (\Exception $e) {
            // Manejo de errores
            return response()->json(['error' => 'No se pudieron obtener los cursos', 'message' => $e->getMessage()], 500);
        }
    }
}
