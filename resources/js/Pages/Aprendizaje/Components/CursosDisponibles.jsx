import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { Button } from "@heroui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CursosDisponibles() {
    const userid = localStorage.getItem("user_id");
    const [cursosDisponibles, setCursosDisponibles] = useState([]);
    const navigate = useNavigate();


    //funcion para llamar al ws de obtener cursos del usuario

    useEffect(() => {
        const obtenerCursosMoodle = async () => {
            try {
                const response = await axios.get(`/moodle/cursos_disponibles/${userid}`, {
                    withCredentials: true
                });

                setCursosDisponibles(response.data)

            } catch (error) {
                console.log("error al obtener los cursos disponibles: ", error)
            }

        }

        obtenerCursosMoodle();
    }, [userid]);

    const handleCourseClick = (id) => {
        navigate("/modulo/cursos/contenido", { state: { courseid: id } })
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
            
            {cursosDisponibles.map((curso, index) => (
                <Card key={curso.id} className="shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
                    <CardHeader className="p-0">
                        {/* Imagen aleatoria de Picsum Photos */}
                        <img
                            src={`https://picsum.photos/400/250?random=${index}`}
                            alt="Imagen del curso"
                            className="w-full h-40 object-cover"
                        />


                    </CardHeader>
                    <CardBody className="p-4">
                        <h2 className="text-xl font-semibold text-blue-700">{curso.fullname}</h2>
                        <div className="text-gray-600 text-sm mt-2" dangerouslySetInnerHTML={{ __html: curso.summary }} />
                    </CardBody>
                    <CardFooter className="p-4 flex justify-end">
                        <Button color="primary" onPress={() => handleCourseClick(curso.id)}>
                            Ver Curso
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )


}