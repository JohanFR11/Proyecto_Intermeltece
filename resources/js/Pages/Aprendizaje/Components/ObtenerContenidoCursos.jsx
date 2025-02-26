import AprendizajeLayout from "../Layout/AprendizajeLayout";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/react";
import { usePage } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";

export default function ObtenerContenidoCursos({ auth, unreadNotifications }) {

    const [cursos, setCursos] = useState([]);
    const [cursoActivo, setCursoActivo] = useState(null);
    const courseid = Number(usePage().props.courseid);

    useEffect(() => {
        const obtenerCursosMoodle = async () => {
            try {

                const response = await axios.get(`/moodle/cursos/${courseid}`, {
                    withCredentials: true
                });

                if (Array.isArray(response.data)) {
                    setCursos(response.data);
                } else {
                    console.error("⚠️ API no devolvió un array:", response.data);
                    setCursos([]); // Evita el error en el render
                }

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

    const handleModuleClick = (modulo,moduleid) => {

        let ruta;
        switch (modulo.modname) {


            case "hvp":
                ruta = "modulo.curso.contenido.quiz";
                break;
            case "assign":
                ruta = "modulo.curso.contenido.asignaciones";
                break;
            default:
                ruta = "modulo.curso.contenido.paginas";
                break;
            }
            Inertia.visit(route(ruta,{courseid, moduleid}))

    };

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
            <AprendizajeLayout>

                <div className="p-6 bg-white min-h-screen flex flex-col items-center">
                    <h1 className="text-3xl font-bold text-blue-600 mb-6">Cursos Disponibles</h1>
                    <button onClick={handleBack} className="absolute top-0 right-0 m-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition">
                        Volver
                    </button>
                    <ul className="w-full max-w-lg space-y-4">
                        {cursos.length > 0 ? (
                            Array.isArray(cursos) && cursos.map((curso) => (
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
                                                            <h3 className="text-lg font-medium text-blue-500 cursor-pointer hover:text-purple-700" onClick={() => handleModuleClick(modulo,modulo.id)}
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
                            ))
                        ) : (<div>
                            <h1>cargando contenido</h1>
                        </div>)}

                    </ul>
                </div>
            </AprendizajeLayout>
        </AuthenticatedLayout>
    );
}

