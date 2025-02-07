import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function ObtenerContenido(){
    
    const [paginas,setPaginas]=useState([]);
    const location = useLocation();
    const { courseid, moduleid } = location.state || {};
    

    useEffect(() => {
        const getPageContent=async()=>{
            
            try {
                const response = await axios.get(`/moodle/cursos/contenido/${courseid}`)
                console.log(response.data)

                setPaginas(response.data)
            } catch (error) {
                console.error("Error al obtener el contenido:", error);
            }
        }
        getPageContent();
    },[])

    return(
        <div>
            <ul>
            </ul>
            
        </div>

    );
}