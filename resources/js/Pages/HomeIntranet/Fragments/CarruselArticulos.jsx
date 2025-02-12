import React from "react";
import CarruselArt from "../Components/CarruselArt";

export default function CarrouselArticulos() {
    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/refresh-token', {
                    refresh_token: refreshToken
                });

                if (response.data.access_token) {
                    localStorage.setItem('access_token', response.data.access_token);

                } else {
                    alert('No se pudo renovar el token de acceso.');
                    console.log("datos recibidos al intentar renovar el token: ", response.data)
                }
            } catch (error) {
                console.error('Error al refrescar el token:', error);
                alert('Error al refrescar el token.');
            }
        } else {
            alert('No se ha encontrado un refresh_token. Por favor, autentica primero. O comunicate con los desarrolladores para poder obtener permisos');
        }
    };
    return (
        <div className="p-5">
            <p className="mb-5 p-2 bg-gray-400 w-full sm:w-64 text-center font-bold">Articulos</p>

            <div className="w-full relative">

                <CarruselArt refreshAccessToken={refreshAccessToken} />

                <a href={route('resources.modulo.articulos')}>
                    <button className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 md:absolute md:bottom-4 md:right-4 md:w-auto md:mt-0">
                        Ver artículos
                    </button>
                </a>
            </div>
        </div>
    );
}
