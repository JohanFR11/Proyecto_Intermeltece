import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardBody, Image } from "@heroui/react";

const AprendizajeLayout = ({ children }) => {

    const [user, setUser] = useState(null);  // Almacena los datos del usuario en google
    const [loading, setLoading] = useState(true);  // Indicador de carga
    const [userMoodle, setUserMoodle] = useState(null);  // Almacena los datos del usuario registrado en moodle
    const userid = localStorage.getItem("user_id")


    useEffect(() => {

        const getProfileInfo = async () => {
            try {
                const response = await axios.get(`/moodle/user/${userid}`, {
                    withCredentials: true
                })
                setUserMoodle(response.data[0])
            } catch (error) {
                console.error("error al traer la informacion del usuario: ", error)
            }
        }
        getProfileInfo();
    }, []);

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
        <div className="bg-white mt-4 mb-4 ml-4 mr-4 p-5">
            <Card
                isBlurred
                className="border-none bg-background/60 dark:bg-default-100/50 w-auto"
                shadow="sm"
            >
                <CardBody>
                    {loading ? (
                        <p>Cargando...</p>  // Si está cargando, muestra este mensaje
                    ) : user && userMoodle ? (
                        <div className="p-5">

                            <div className="mb-5 grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                                <div className="col-span-6 md:col-span-3 flex items-center">
                                    {user.avatar ? (
                                        <Image
                                            alt="Avatar del usuario"
                                            className="object-cover w-[96px] h-[96px] rounded-full drop-shadow-lg"
                                            src={user.avatar}
                                        />
                                    ) : (
                                        <div>No hay imagen de avatar</div>
                                    )}
                                </div>
                                <div className="flex text-center flex-col col-span-6 md:col-span-7">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col gap-0">
                                            <h2 className="text-large font-medium mt-2">{userMoodle.fullname}</h2>
                                            <p className="text-large font-medium mt-2">{userMoodle.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <main className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-4">
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg p-5">
                                    {children}  {/* Aquí se renderizan las páginas del módulo */}
                                </div>
                            </main>
                        </div>
                    ) : (
                        <p>No autenticado</p>  // Si no hay usuario, muestra este mensaje
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default AprendizajeLayout;
