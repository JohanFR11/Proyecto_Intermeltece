import axios from "axios";
import React, { useState, useEffect } from "react";
const AuthenticatedLayout = React.lazy(() => import('@/Layouts/AuthenticatedLayout'));
/* const InputEmail = React.lazy(() => import("./Components/InputEmail")); */
const InfoUser = React.lazy(() => import("./Fragments/InfoKpis"));

const Index = ({ auth, unreadNotifications }) => {

    const [user, setUser] = useState(null);
    const [status, setStatus] = useState(null);
    const [secondStatus, setSecondStatus] = useState(null);

    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
            try {
                const response = await axios.post('http://127.0.0.1:8000/empresarial/refresh-token', {
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

    useEffect(() => {
        axios
            .get("/user", { withCredentials: true }) // Llamada a la API
            .then((res) => {
                const accessTokenDB = res.data.name; // Extrae directamente el token
                setUser(accessTokenDB); // Guarda el token en el estado
            })
            .catch((error) => {
                console.error("Error al obtener el usuario:", error);
                setUser(null); // Si hay error, no hay usuario
            })
    }, []);


    useEffect(() => {
        if (user) { // Verifica que `user` tenga un valor antes de hacer la llamada
            axios
                .get(`/estado/${user}`)
                .then((response) => {     
                    // Verificar que response.data no sea undefined o vacío antes de acceder a índices
                    if (response.data && response.data.length > 0) {
                        const estado_empleado = response.data[0]; // Accede de manera segura

                        // Extraer el valor 'primer_estado' del objeto si existe
                        const extactor = estado_empleado['primer_estado'];
    
                        // Comparación y lógica condicional
                        if (extactor === 0) {
                            setStatus(false)
                        } else {
                            setStatus(true)

                        }

                        const segundo_estado_empleado = response.data[0]; // Accede de manera segura

                        // Extraer el valor 'primer_estado' del objeto si existe
                        const extactor_estado_dos = segundo_estado_empleado['segundo_estado'];
    
                        // Comparación y lógica condicional
                        if (extactor_estado_dos === 0) {
                            setSecondStatus(false)
                        } else {
                            setSecondStatus(true)
                        }
                    } else {
                        console.error("La respuesta no contiene datos.");
                    }
                })
                .catch((error) => {
                    console.error("Error al obtener el estado del usuario:", error);
                });
        }
    }, [user]);
    
       
    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Firma de Kpi's</h2>
            }
        >
            <div className="mt-5 bg-white overflow-hidden shadow-lg sm:rounded-lg p-4">
                <InfoUser refreshAccessToken={refreshAccessToken} name={user} status={status} secondStatus={secondStatus}/>
            </div>
        </AuthenticatedLayout>
    )
}

export default Index;