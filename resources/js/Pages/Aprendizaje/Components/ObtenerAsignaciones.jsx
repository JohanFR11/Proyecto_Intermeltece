import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardBody } from "@heroui/react";

export default function ObtenerAsignaciones({ token }) {

    const [assignContent, setAssignContent] = useState([])
    const location = useLocation();
    const navigate = useNavigate();
    const { courseid, moduleid } = location.state || {};


    useEffect(() => {
        const obtenerCursosMoodle = async () => {
            try {

                const response = await axios.get(`/moodle/cursos/contenido/asignaciones/${courseid}`);

                const contenido = response.data.courses[0].assignments

                const asignacionEncontrada = contenido.find(
                    (pagina) => pagina.cmid === moduleid
                );

                setAssignContent(asignacionEncontrada)

            } catch (error) {
                console.error("Error al obtener los cursos:", error);
            }
        };
        obtenerCursosMoodle();
    }, [courseid]);
    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1); // Vuelve atrás en la navegación
        } else {
            navigate("/modulo/index"); // Si no hay historial, redirige a una página específica
        }
    };

    return (
        <div className="p-6 bg-white min-h-screen flex flex-col items-center">

            {assignContent ? (
                <Card className="w-full max-w-1xl bg-blue-100 border border-blue-300 rounded-lg shadow-md">
                    <CardBody>
                        <div className="flex justify-end w-full mb-4">
                            <button
                                onClick={handleBack}
                                className="px-4 py-2 right-0 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition w-30">
                                Volver
                            </button>
                        </div>
                        <h1 className="text-2xl font-bold text-blue-700 mb-4">{assignContent.name}</h1>
                        <div className="text-lg text-gray-700" dangerouslySetInnerHTML={{ __html: assignContent.intro }} />
                        <div className="text-lg mt-4 text-gray-700" dangerouslySetInnerHTML={{ __html: assignContent.activity }} />
                        {/* Mostrar archivos adjuntos en la asignación */}
                        {assignContent.introattachments && assignContent.introattachments.length > 0 ? (
                            <div className="mt-4">
                                <h2 className="text-lg font-semibold text-blue-600">Archivos Adjuntos</h2>
                                <ul className="mt-2 space-y-2">
                                    {assignContent.introattachments.map((file, index) => (
                                        <li key={index} className="bg-white p-2 rounded-md shadow-md hover:bg-purple-100 transition">
                                            <a
                                                href={`${file.fileurl}?token=${token}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-purple-700"
                                            >
                                                📎 {file.filename} ({file.mimetype})
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p className="mt-4 text-gray-600">No hay archivos adjuntos en esta asignación.</p>
                        )}
                    </CardBody>
                </Card>
            ) : (
                <p className="text-gray-500 text-lg">Cargando contenido...</p>
            )}
        </div>
    );
}