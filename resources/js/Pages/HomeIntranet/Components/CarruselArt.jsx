import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import axios from "axios";
import { Carousel, IconButton } from "@material-tailwind/react";

export default function CarruselArt({ refreshAccessToken }) {
    const [listedFiles, setListedFiles] = useState([]);
    const [itemsPerSlide, setItemsPerSlide] = useState(3); // Número de tarjetas por slide

    // Detectar cambios de tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsPerSlide(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerSlide(2);
            } else {
                setItemsPerSlide(3);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Llamar una vez al inicio

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const listFiles = async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        let token;
        const tokenExpiry = 3599;

        if (!token || (tokenExpiry && Date.now() > parseInt(tokenExpiry, 10))) {
            try {
                await refreshAccessToken();
                token = localStorage.getItem("access_token");
                if (!token) {
                    alert("No se pudo obtener un token válido.");
                    return;
                }
            } catch (error) {
                alert("Error al renovar el token: " + error.message);
                return;
            }
        }

        try {
            const response = await axios.get("https://internal.meltec.com.co/articulos-archivos", {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
                refresh_token: refreshToken,
            });

            setListedFiles(response.data.files || []);
        } catch (error) {
            console.error("Error al listar archivos:", error);
        }
    };

    // Función para dividir los archivos según `itemsPerSlide`
    const chunkFiles = (files, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < files.length; i += chunkSize) {
            chunks.push(files.slice(i, i + chunkSize));
        }
        return chunks;
    };

    useEffect(() => {
        listFiles();
    }, []);

    // Crear los bloques de archivos según el tamaño de pantalla
    const fileChunks = chunkFiles(listedFiles, itemsPerSlide);

    return (
        <div className="p-4">
            {fileChunks.length > 0 ? (
                <Carousel
                    key={itemsPerSlide} // Fuerza el rerender cuando cambia `itemsPerSlide`
                    className="rounded-xl overflow-hidden w-full h-[400px]"
                    prevArrow={({ handlePrev }) => (
                        <IconButton
                            variant="text"
                            color="cyan"
                            size="lg"
                            onClick={handlePrev}
                            className="!absolute top-2/4 left-4 -translate-y-2/4"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </IconButton>
                    )}
                    nextArrow={({ handleNext }) => (
                        <IconButton
                            variant="text"
                            color="cyan"
                            size="lg"
                            onClick={handleNext}
                            className="!absolute top-2/4 !right-4 -translate-y-2/4"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-6 w-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </IconButton>
                    )}
                >

                    {fileChunks.map((chunk, index) => (
                        <div key={index} className="flex justify-center items-center h-full w-full">
                            {chunk.map((file, i) => (
                                <a
                                    key={i}
                                    href={file.webViewLink}
                                    className="flex flex-col items-center bg-gradient-to-b from-[#395181] via-[#446099] to-[#5072b6] p-4 rounded-xl shadow-lg transition-transform hover:scale-105 w-full sm:w-auto ml-2"
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    <img src={file.thumbnailLink} className="h-[250px] w-[250px] object-cover rounded-lg" />
                                    <p className="mt-3 font-bold text-sm max-w-full line-clamp-3 text-white w-[210px] text-center">{file.file_name}</p>
                                </a>
                            ))}
                        </div>

                    ))}
                </Carousel>
            ) : (
                <div className="text-center text-gray-600 text-lg font-semibold">No se encontraron artículos.</div>
            )}
        </div>
    );
}
