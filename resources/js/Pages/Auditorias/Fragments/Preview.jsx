import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { motion } from "framer-motion";

export default function Preview({ fileID, refreshAccessToken }) {

    const [fileBlob, setFileBlob] = useState("");

    useEffect(() => {
        const fetchFileBlob = async () => {
            let token = localStorage.getItem('access_token');
            const tokenExpiry = 3599;

            // Verificar si el token está vencido
            const isTokenExpired = tokenExpiry && Date.now() > parseInt(tokenExpiry, 10);

            if (!token || isTokenExpired) {
                await refreshAccessToken();
                token = localStorage.getItem('access_token');
            }

            if (!token) {
                console.error('No se pudo obtener un token válido.');
                return;
            }

            try {
                const response = await axios.get(`https://www.googleapis.com/drive/v3/files/${fileID}?alt=media`, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'Authorization': `Bearer ${token}`
                    },
                })
                setFileBlob(URL.createObjectURL(response.data));
            } catch (error) {
                console.error("Error al obtener el archivo:", error.response ? error.response.data : error.message);
            }
        };

        if (fileID) fetchFileBlob();
    }, [fileID]);

    return (
        <div className="">
            {fileBlob ? (
                <motion.iframe
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5 }}
                    src={fileBlob}
                    className="w-auto h-auto"
                />
            ) : (
                <p>Cargando pre visualizacion...</p>
            )}
        </div>

    );

}