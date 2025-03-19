import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/react";
import { Inertia } from "@inertiajs/inertia";

export default function ObtenerPaginas({ auth, unreadNotifications }) {
    const [pageContent, setPageContent] = useState([]);
    const token = localStorage.getItem('moodle_token')
    const [contentWithToken, setContentWithToken] = useState("");
    const [introWithToken, setIntroWithToken] = useState("");
    const courseid = Number(usePage().props.courseid);
    const moduleid = Number(usePage().props.moduleid);
    console.log("id de curso y modulo ",typeof(courseid), typeof(moduleid))

    useEffect(() => {

        const getPageContent = async () => {
            try {
                const response = await axios.get(
                    `/moodle_ws/cursos/contenido/${courseid}`,
                    {
                        withCredentials: true
                    }
                );
                const contenido = response.data.pages;
                
                const paginaEncontrada = contenido.find((pagina) =>pagina.coursemodule === moduleid);

                
                setPageContent(paginaEncontrada);
            } catch (error) {
                console.error("Error al obtener el contenido:", error);
            }
        };
        getPageContent();
    }, [courseid, moduleid]);

    useEffect(() => {

        if (pageContent?.content) {
            const updatedContent = pageContent.content.replace(
                /(<img[^>]+src=["'])(http:\/\/127.0.0.1\/moodle\/webservice\/pluginfile\.php[^"']+)/g,
                `$1$2?token=${token}`
            );
            const updatedIntro = pageContent.intro.replace(
                /(<img[^>]+src=["'])(http:\/\/127.0.0.1\/moodle\/webservice\/pluginfile\.php[^"']+)/g,
                `$1$2?token=${token}`
            );
            console.log("Contenido modificado:", updatedContent);
            setContentWithToken(updatedContent);
            setIntroWithToken(updatedIntro)
        }
    }, [pageContent, token]);

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

            <div className="p-6 bg-white min-h-screen flex flex-col items-center p-4">
                {pageContent ? (
                    <Card className="w-full max-w-1xl bg-blue-100 border border-blue-300 rounded-lg shadow-md">
                        <CardBody>
                            <div className="flex justify-end w-full mb-4">
                                <button
                                    onClick={handleBack}
                                    className="px-4 py-2 right-0 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition w-30">
                                    Volver
                                </button>
                            </div>
                            <h1 className="text-lg font-semibold text-blue-600">Introduccion:</h1>
                            <div className="text-base text-gray-700" dangerouslySetInnerHTML={{ __html: introWithToken }} />
                            <h1 className="text-lg font-semibold text-blue-600">Contenido:</h1>
                            <div className="mt-4 text-base text-gray-700" dangerouslySetInnerHTML={{ __html: contentWithToken }} />
                        </CardBody>
                    </Card>
                ) : (
                    <p className="text-gray-500 text-lg">Cargando contenido...</p>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
