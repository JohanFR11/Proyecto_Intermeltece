<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class MoodleController extends Controller
{

    private const token="mitokendemoodle";
    private const moodleUrl='http://127.0.0.1/moodle/webservice/rest/server.php';
    /**
     * Obtener los cursos de un usuario
     */
    public function getUserCourses($courseid)
    {   
        $function = "core_course_get_contents";
        

        $client = new Client();

        try {
            // Hacer la petición a Moodle
            $response = $client->request('GET', self::moodleUrl, [
                'query' => [
                    'wstoken' => self::token,
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

    public function getCoursesContent($courseid)
    {   
        $function = "mod_page_get_pages_by_courses";
        

        $client = new Client();

        try {
            // Hacer la petición a Moodle
            $response = $client->request('GET', self::moodleUrl, [
                'query' => [
                    'wstoken' => self::token,
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

}
