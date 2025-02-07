import axios from "axios";
import React, { useEffect, useState } from "react";
import ObtenerContenido from "./ObtenerContenido";
import { useNavigate } from "react-router-dom";

//para relacionar el modulo con el contenido se debe relacionar el id del modulo con el coursemodule de la pagina que muestra los datos

export default function ObtenerCursos() {
    
    const [cursos, setCursos] = useState([]);
    const [cursoActivo, setCursoActivo] = useState(null);
    const navigate = useNavigate(); // Hook para redirigir

    useEffect(() => {
        const obtenerCursosMoodle = async () => {
            try {
                let courseid=2;
                const response = await axios.get(`/moodle/cursos/${courseid}`); 
                
                console.log('esta es la data de los cursos',response.data);
                
                setCursos(response.data); // Guardar cursos en el estado
                
            } catch (error) {
                console.error("Error al obtener los cursos:", error);
            }
        };
        obtenerCursosMoodle();
    }, []);

    //Esto es el que se encarga de mostrar u ocultar los modulos de cada curso
    const toggleCurso = (id) => {
        setCursoActivo(prevId => (prevId === id ? null : id));
    };

    return (
        <div>
            <h2>Modulo de Capacitaciones</h2>
            <ul>
                {cursos.map((curso) => (
                    <li key={curso.id}>
                        <h1 onClick={() => toggleCurso(curso.id)} style={{ cursor: "pointer", color: "blue" }}>{curso.name}</h1>
                        {cursoActivo === curso.id && (
                            <ul>
                                {curso.modules.map((modulo) => (
                                    <li key={modulo.id}>
                                        <h1 onClick={() =>  navigate('/contenido', {state: { courseid: curso.id, moduleid: modulo.id }})} style={{ cursor: "pointer", color: "green" }}
                                        >
                                            {modulo.name}
                                        </h1>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

