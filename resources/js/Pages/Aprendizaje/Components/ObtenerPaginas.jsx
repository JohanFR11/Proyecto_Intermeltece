import axios from "axios";
import { useLocation,useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Card, CardBody } from "@heroui/react";

export default function ObtenerPaginas({token}) {
    const [pageContent, setPageContent] = useState([]);
    const location = useLocation();
    const { courseid, moduleid } = location.state || {};
    const navigate = useNavigate();
    const [contentWithToken, setContentWithToken] = useState("");
    const [introWithToken, setIntroWithToken] = useState("");


    useEffect(() => {
        if (!courseid || !moduleid) return;

        const getPageContent = async () => {
            try {
                const response = await axios.get(
                    `/moodle/cursos/contenido/${courseid}`,
                    {
                        withCredentials: true
                    }
                );

                const contenido = response.data.pages;

                const paginaEncontrada = contenido.find((pagina) => pagina.coursemodule === moduleid);

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
                /(<img[^>]+src=["'])(http:\/\/localhost\/moodle\/webservice\/pluginfile\.php[^"']+)/g,
                `$1$2?token=${token}`
            );
            const updatedIntro = pageContent.intro.replace(
                /(<img[^>]+src=["'])(http:\/\/localhost\/moodle\/webservice\/pluginfile\.php[^"']+)/g,
                `$1$2?token=${token}`
            );
            setContentWithToken(updatedContent);
            setIntroWithToken(updatedIntro)
        }
    }, [pageContent, token]);

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1); // Vuelve atrás en la navegación
        } else {
            navigate("/modulo/index"); // Si no hay historial, redirige a una página específica
        }
    };

    return (

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
    );
}
