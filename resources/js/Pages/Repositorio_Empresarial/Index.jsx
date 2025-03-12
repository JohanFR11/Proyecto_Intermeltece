import React from "react";
import axios from "axios";

const AuthenticatedLayout = React.lazy(() => import('@/Layouts/AuthenticatedLayout'));
const Repo_empresarial = React.lazy(() => import('./Components/Repo_empresarial'));
import { SnackbarProvider } from 'notistack';

const Index = ({ auth, unreadNotifications }) => {

    const refreshAccessToken = async () => { 
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
            try {
                const response = await axios.post('https://internal.meltec.com.co/empresarial/refresh-token', {
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
            alert('No se encontro un refresh_token. Autenticate primero.');
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Repositorio Empresarial</h2>
            }>
            <SnackbarProvider maxSnack={3}>
                <div className="mt-5 bg-white overflow-hidden shadow-lg sm:rounded-lg p-4">
                    <Repo_empresarial refreshAccessToken={refreshAccessToken} />
                </div>
            </SnackbarProvider>
        </AuthenticatedLayout>
    );
};

export default Index;