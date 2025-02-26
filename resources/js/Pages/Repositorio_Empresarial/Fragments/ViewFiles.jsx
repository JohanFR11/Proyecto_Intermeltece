import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { motion } from "framer-motion";

export default function ViewFiles({ fileID, refreshAccessToken, open, close, size }) {

    const [fileBlob, setFileBlob] = useState("");

    useEffect(() => {
        const fetchFileBlob = async () => {
            let token = localStorage.getItem("access_token");

            const tokenExpiry = 3599;

            // Verificar si el token está vencido
            const isTokenExpired = tokenExpiry && Date.now() > parseInt(tokenExpiry, 10);

            if (!token || isTokenExpired) {
                await refreshAccessToken();
                token = localStorage.getItem('access_token');
            }

            if (!token) return;


            try {
                const response = await axios.get(
                    `https://www.googleapis.com/drive/v3/files/${fileID}?alt=media`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        responseType: "blob",
                    }
                );
                setFileBlob(URL.createObjectURL(response.data));
            } catch (error) {
                console.error("Error al obtener el archivo:", error);
            }
        };

        if (fileID) fetchFileBlob();
    }, [fileID]);

    return (
        <Modal size={size} isOpen={open} onClose={close} className="inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <ModalContent className="bg-white rounded-xl shadow-2xl p-3">
                <ModalHeader className="text-2xl font-bold text-center text-gray-800 border-b pb-4">
                    Especificaciones del Modelo Ulefone
                </ModalHeader>
                <ModalBody className="h-full w-full">
                    <div className="h-full w-full">
                        {fileBlob ? (
                            <motion.iframe
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.5 }}
                                src={fileBlob}
                                className="w-full h-full"
                            />
                        ) : (
                            <p>Cargando pre visualizacion...</p>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter className="flex justify-end border-t">
                    <Button
                        onPress={close}
                        className="py-3 px-4 text-center w-[60px] bg-[#395181] rounded-xl text-white ml-3 duration-200 hover:bg-[#4c6baa] "
                    >
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );

}