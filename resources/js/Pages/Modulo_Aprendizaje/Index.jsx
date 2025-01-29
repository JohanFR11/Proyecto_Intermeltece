import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Index = ({ auth, unreadNotifications }) => {
    const [user, setUser] = useState(null);  // Almacena los datos del usuario
    const [loading, setLoading] = useState(true);  // Indicador de carga

    useEffect(() => {
        axios
            .get("/user", { withCredentials: true })  // Llamada a la API
            .then((res) => {
                setUser(res.data);  // Guarda la respuesta de la API en el estado
            })
            .catch(() => {
                setUser(null);  // Si hay error, no hay usuario
            })
            .finally(() => {
                setLoading(false);  // Marca como "no cargando" después de la solicitud
            });
    }, []);

    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">  Modulo de aprendizaje</h2>
            }
        >
            <div>
                <h2>Bienvenido</h2>
                {loading ? (
                    <p>Cargando...</p>  // Si está cargando, muestra este mensaje
                ) : user ? (
                    <div>
                        <p><strong>ID:</strong> {user.id}</p>  // Muestra el ID del usuario
                        <p><strong>Nombre:</strong> {user.name}</p>  // Muestra el nombre del usuario
                        <p><strong>Email:</strong> {user.email}</p>  // Muestra el email del usuario
                    </div>
                ) : (
                    <p>No autenticado</p>  // Si no hay usuario, muestra este mensaje
                )}
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
