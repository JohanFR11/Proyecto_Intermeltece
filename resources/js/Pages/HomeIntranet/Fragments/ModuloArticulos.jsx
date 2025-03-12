import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ListadoArticulos from "../Components/ListadoArticulos";

const Articulos = ({ auth, unreadNotifications }) => {
    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const response = await axios.post('https://internal.meltec.com.co/refresh-token', {
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
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className='font-semibold text-xl text-gray-800 leading-tight'>
                    Articulos - Reflexiones para Crecer
                </h2>
            }
        >
            <div className="p-4 m-5 bg-white rounded-md">
                <ListadoArticulos refreshAccessToken={refreshAccessToken}/>
            </div>
        </AuthenticatedLayout>
    );
};

export default Articulos;
