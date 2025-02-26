import axios from "axios";
import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

export default function ObtenerQuiz({ auth, unreadNotifications }) {

    const courseid = Number(usePage().props.courseid);
    const moduleid = Number(usePage().props.moduleid);
    const [quiz, setQuiz] = useState([]);
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const obtenerCursosMoodle = async () => {
            try {

                const response = await axios.get(`/moodle/cursos/${courseid}`, {
                    withCredentials: true
                });

                const contenido = response.data;

                let paginaEncontrada = null;
                let i = 0;
                while (i < contenido.length) {
                    const newContent = contenido[i].modules;

                    paginaEncontrada = newContent.find((quiz) => quiz.id === moduleid);
                    if (paginaEncontrada) break;
                    i++;
                }
                setQuiz(paginaEncontrada);


            } catch (error) {
                console.error("Error al obtener el contenido:", error);
            } finally {
                setLoading(false); // Finaliza la carga
            }
        };

        obtenerCursosMoodle();

    }, [courseid]);


    const handleBack = () => {
        if (window.history.length > 1) {
            Inertia.visit(window.history.back()); // Regresa a la página anterior
        } else {
            Inertia.visit(route("modulo.index")); // Redirige a una página específica si no hay historial
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Modulo de aprendizaje</h2>
            }
        >

        <div className="relative flex flex-col items-center justify-center min-h-screen bg-white text-blue-900">
            {loading ? (
                <h1 className="text-2xl font-semibold">Cargando contenido...</h1>
            ) : quiz ? (
                <>
                    <button
                        onClick={handleBack}
                        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
                    >
                        Volver
                    </button>

                    {/* Título de la Actividad */}
                    <h2 className="text-3xl font-bold mb-6">{quiz.name}</h2>

                    {/* Contenedor de la Actividad */}
                    <div className="bg-blue-50 p-6 rounded-xl shadow-lg w-full max-w-3xl text-center">
                        {/* Iframe Responsivo */}
                        <div className="relative w-full overflow-hidden" style={{ paddingBottom: "75%" }}>
                            {/* {iframeSrc ? ( */}
                            <iframe
                                src={`http://127.0.0.1/moodle/mod/hvp/embed.php?id=${quiz.id}`}
                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                height="256"
                                allowFullScreen
                                title="Quiz en H5P">
                            </iframe>
                            {/* ) : (
                                <h1 className="text-xl font-semibold">No se pudo cargar la actividad</h1>
                                )} */}
                        </div>
                    </div>
                </>
            ) : (
                <h1 className="text-2xl font-semibold">no se encontró contenido disponible</h1>
            )}
        </div>
            </AuthenticatedLayout>

    );
}
