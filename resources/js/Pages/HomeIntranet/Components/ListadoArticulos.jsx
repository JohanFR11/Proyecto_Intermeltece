import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import axios from "axios";

export default function ListadoArticulos({ refreshAccessToken }) {
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

            if (!response.data.files) {
                setListedFiles([]);
            } else {
                setListedFiles(response.data.files);
            }
        } catch (error) {
            console.error("Error al listar archivos:", error);
        }
    };
    useEffect(() => {
        listFiles();
    }, []);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {listedFiles.length > 0 ? (
                listedFiles.map((file, index) => (
                    <Card key={index} className="max-w-xs mx-auto">
                        <CardHeader className="items-start bg-gradient-to-b from-[#395181] via-[#395181] to-[#395181] text-white p-4">
                            <h4 className="font-bold text-sm max-w-full line-clamp-2">{file.file_name}</h4>
                        </CardHeader>
                        <CardBody className="overflow-visible items-center bg-gradient-to-b from-[#395181] via-[#446099] to-[#5072b6] p-4">
                            {file.thumbnailLink ? (
                                <a href={file.webViewLink} target="_blank" rel="noopener noreferrer">
                                    <Image
                                        alt="Card background"
                                        className="object-cover rounded-xl shadow-md shadow-white mb-3 transform hover:scale-110 transition-transform duration-300"
                                        src={file.thumbnailLink}
                                        width={260}
                                        height={150}
                                    />
                                </a>
                            ) : (
                                <div>
                                    <p>No se tiene imagen</p>
                                </div>
                            )}
                        </CardBody>
                    </Card>
                ))
            ) : (
                <div>
                    <p>No se encontró el artículo</p>
                </div>
            )}
        </div>
    );
}
