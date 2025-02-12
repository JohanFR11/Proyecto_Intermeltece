import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import axios from "axios";
import { Carousel, IconButton } from "@material-tailwind/react";

export default function CarruselArt({ refreshAccessToken }) {
    const [listedFiles, setListedFiles] = useState([]);

    const listFiles = async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        let token;
        const tokenExpiry = 3599;

        // Verificar si el token está vencido
        const isTokenExpired = tokenExpiry && Date.now() > parseInt(tokenExpiry, 10);

        if (!token || isTokenExpired) {
            // Si no hay token o está vencido, intentar refrescarlo
            try {
                await refreshAccessToken(); // Refrescar el token
                token = localStorage.getItem("access_token"); // Recuperar el nuevo access token
                console.log(token);

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
            const response = await axios.get("http://127.0.0.1:8000/articulos-archivos", {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
                refresh_token: refreshToken,
            });

            if (!response.data.files) {
                setListedFiles([]);
            } else {
                setListedFiles(response.data.files);
            }
        } catch (error) {
            console.error("Error al listar archivos:", error);
        }
    };

    // Función para dividir los archivos en bloques de 3
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

    // Crear los bloques de 3 archivos para el carrusel
    const fileChunks = chunkFiles(listedFiles, 3);

    return (
        <div className="p-4">
            {fileChunks.length > 0 ? (
                <Carousel
                    className="rounded-xl overflow-hidden w-full h-[400px]"
                    prevArrow={({ handlePrev }) => (
                        <IconButton
                            variant="text"
                            color="#00FFFF"
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
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                                />
                            </svg>
                        </IconButton>
                    )}
                    nextArrow={({ handleNext }) => (
                        <IconButton
                            variant="text"
                            color="#00FFFF"
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
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                />
                            </svg>
                        </IconButton>
                    )}
                >
                    {fileChunks.map((chunk, index) => (
                        <div key={index} className="flex justify-center gap-4 items-center h-full">
                            {chunk.map((file, index) => (
                                <img
                                    key={index}
                                    src={file.thumbnailLink}
                                    className="h-[250px] w-[250px] object-cover rounded-lg"
                                />
                            ))}
                        </div>
                    ))}
                </Carousel>
            ) : (
                <div>
                    <p>No se encontró el artículo</p>
                </div>
            )}
        </div>
    );
}
