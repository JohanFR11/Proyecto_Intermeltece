import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ImagenUno from './Img/signo.png';
import ImagenDos from './Img/portapapeles.png';
const Principal = React.lazy(() => import('./Components/Principal'));
import { motion } from "framer-motion";

const Index = ({ auth, unreadNotifications }) => {

    const [Principio, setPrincipio] = useState(true);
    const [DocsFirmados, setDocsFirmados] = useState(false);

    const handleestado = () => {
        setPrincipio(false);
        setDocsFirmados(true);
    }

    const accionderegreso = () => {
        setPrincipio(true);
        setDocsFirmados(false);
    }

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
            try {
                console.log(refreshToken)
                const response = await axios.post('http://127.0.0.1:8000/director/refresh-token', {
                    refresh_token: refreshToken
                });

                if (response.data.access_token) {
                    localStorage.setItem('access_token', response.data.access_token);
                } else {
                    console.error("No se pudo renovar el token de acceso. Datos recibidos:", response.data);
                    alert('No se pudo renovar el token de acceso.');
                }
            } catch (error) {
                console.error('Error al refrescar el token:', error);
                alert('Error al refrescar el token.');
            }
        } else {
            alert('No se encontró un refresh_token. Autentícate primero.');
        }
    };

    return (
        <AuthenticatedLayout auth={auth} unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Auditoria Modulo B</h2>
            }>
            <div className="bg-white mt-4 mb-4 ml-4 mr-4 p-5">

                {Principio && (
                    <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.7 }}
                    className="flex flex-col md:flex-row items-center justify-center"
                >
                        <h1 className="m-6 flex items-center justify-center"><strong> Actividades auditoría Revisoría Fiscal año 2025 </strong></h1>
                    </motion.div>
                )}

                {Principio && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.7 }}
                        className="flex flex-col md:flex-row items-center justify-center"
                    >
                        <div className="flex flex-col items-center md:mr-14 mb-4 md:mb-0 cursor-pointer" onClick={() => handleestado()}>
                            <img src={ImagenUno} className="w-[65px] h-[65px]" alt="Signo" />
                            <p className="text-center border border-gray-400/20 rounded-lg p-4">Documentos Firmados <br /> Actividades Revisoría Fiscal</p>
                        </div>
                        <div className="flex flex-col items-center cursor-pointer">
                            <img src={ImagenDos} className="w-[65px] h-[65px]" alt="Signo" />
                            <p className="text-center border border-gray-400/20 rounded-lg p-4">Lista de Chequeo</p>
                        </div>
                    </motion.div>
                )}
                {DocsFirmados && (
                    <Suspense fallback={<div>Cargando...</div>}>
                        <div>
                            <Principal accion={() => accionderegreso()} refreshAccessToken={refreshAccessToken} />
                        </div>
                    </Suspense>
                )}

            </div>
        </AuthenticatedLayout>
    )
}

export default Index;