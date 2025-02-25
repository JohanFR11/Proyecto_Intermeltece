import axios from "axios";
import React, { useEffect, useState } from "react";
import {useNavigate, useLocation} from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/react";

export default function ObtenerConteidoCursos() {

    const [cursos, setCursos] = useState([]);
    const [cursoActivo, setCursoActivo] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { courseid } = location.state || {};

    useEffect(() => {
        const obtenerCursosMoodle = async () => {
            try {

                const response = await axios.get(`/moodle/cursos/${courseid}`, {
                    withCredentials: true
                });

                setCursos(response.data); // Guardar cursos en el estado

            } catch (error) {
                console.error("Error al obtener los cursos:", error);
            }
        };
        obtenerCursosMoodle();
    }, [courseid]);

    //Esto es el que se encarga de mostrar u ocultar los modulos de cada curso
    const toggleCurso = (id) => {
        setCursoActivo(prevId => (prevId === id ? null : id));
    };

    const handleModuleClick = (modulo) => {

        let ruta;
        switch (modulo.modname) {

            

            case "hvp":
                ruta = "/modulo/cursos/contenido/quiz";
                break;
            case "assign":
                ruta = "/modulo/cursos/contenido/asignaciones";
                break;
            default:
                ruta = "/modulo/cursos/contenido/paginas";
                break;
            }

           navigate (ruta, {state: {courseid:courseid, moduleid: modulo.id, contextid: modulo.contexid}})

    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1); // Vuelve atrás en la navegación
        } else {
            navigate("/modulo/index"); // Si no hay historial, redirige a una página específica
        }
    };

    return (
        <div className="p-6 bg-white min-h-screen flex flex-col items-center">
            <h1 className="text-3xl font-bold text-blue-600 mb-6">Cursos Disponibles</h1>
            <button onClick={handleBack} className="absolute top-0 right-0 m-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition">
                Volver
            </button>
            <ul className="w-full max-w-lg space-y-4">
                {cursos.map((curso) => (
                    <Card key={curso.id} className="bg-blue-100 border border-blue-300 rounded-lg shadow-md">
                        <CardBody>
                        <h2 className="text-xl font-semibold text-blue-700 cursor-pointer hover:text-purple-600 transition" onClick={() => toggleCurso(curso.id)} >{curso.name}</h2>
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: cursoActivo === curso.id ? "auto" : 0, opacity: cursoActivo === curso.id ? 1 : 0 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                        {cursoActivo === curso.id && (
                            <ul className="mt-3 space-y-2">
                                {curso.modules.map((modulo) => (
                                    <li key={modulo.id} className="bg-white p-3 rounded-md shadow-md hover:bg-purple-100 transition">
                                        <h3 className="text-lg font-medium text-blue-500 cursor-pointer hover:text-purple-700" onClick={() => handleModuleClick(modulo)}
                                        >
                                            {modulo.name}
                                        </h3>
                                    </li>
                                ))}
                            </ul>
                        )}
                        </motion.div>
                        </CardBody>
                    </Card>
                ))}
            </ul>
        </div>
    );
}

