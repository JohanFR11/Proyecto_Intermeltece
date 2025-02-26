import React, { useState } from "react";
import axios from "axios";
import CarruselArt from "../Components/CarruselArt";
import { Divider } from '@heroui/react'

export default function CarrouselArticulos({ usertoken }) {

    const [accessToken, setAccessToken] = useState(null);

    // Función para refrescar el token
    const refreshAccessToken = async () => {
        let refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken && usertoken) {
            refreshToken = usertoken;
        }

        if (!refreshToken) {
            console.warn("⚠ No se encontró refresh_token en localStorage ni en usertoken:", { usertoken });
            alert("No se ha encontrado un refresh_token. Por favor, autentica primero o comunícate con los desarrolladores.");
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/refresh-token", {
                refresh_token: refreshToken,
            });

            if (response.data.access_token) {
                localStorage.setItem("access_token", response.data.access_token);
                setAccessToken(response.data.access_token);
            } else {
                alert("No se pudo renovar el token de acceso.");
                console.log("📡 Respuesta del servidor al renovar el token:", response.data);
            }
        } catch (error) {
            console.error("❌ Error al refrescar el token:", error);
            alert("Error al refrescar el token.");
            // Opcional: Redirigir al login si no se puede refrescar el token
            window.location.href = "/articulos"; // O donde desees redirigir
        }
    };

    return (
        <div className="p-5">
            <Divider className='h-[10px]' />
            <p className="mb-5 p-2 bg-[#dcdcdc] w-full sm:w-64 text-center font-bold">
                Artículos - Reflexiones para Crecer
            </p>

            <div className="w-full relative">
                <CarruselArt refreshAccessToken={refreshAccessToken} />

                <a href={route("resources.modulo.articulos")}>
                    <button className="p-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600">
                        Ver artículos
                    </button>
                </a>
            </div>
        </div>
    );
}
