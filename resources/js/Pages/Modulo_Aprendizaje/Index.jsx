import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, CardBody, Image } from "@heroui/react";
import Capacitaciones from "./Fragments/Capacitaciones";

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

    const redirectTo = (ruta) => {
        window.location.href = ruta;
    };

    const getGoogleDriveImageURL = (driveUrl) => {
        const fileId = driveUrl.split('/d/')[1]?.split('/')[0]; // Extraer el fileId

        console.log(fileId)

        return `https://lh3.googleusercontent.com/d/${fileId}`; // Generar URL directa
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Modulo de aprendizaje</h2>
            }
        >
            <div className="bg-white mt-4 mb-4 ml-4 mr-4 p-5">
                <Card
                    isBlurred
                    className="border-none bg-background/60 dark:bg-default-100/50 w-auto"
                    shadow="sm"
                >
                    <CardBody>
                        {loading ? (
                            <p>Cargando...</p>  // Si está cargando, muestra este mensaje
                        ) : user ? (
                            <div className="p-5">
                                <div className="mb-5 grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
                                    <div className="col-span-6 md:col-span-3 flex items-center">
                                        {user.avatar ? (
                                            <Image
                                                alt="Avatar del usuario"
                                                className="object-cover w-[96px] h-[96px] rounded-full drop-shadow-lg"
                                                src={user.avatar}  // Verifica si existe avatar
                                            />
                                        ) : (
                                            <div>No hay imagen de avatar</div>  // Mensaje alternativo si no tiene avatar
                                        )}
                                    </div>

                                    <div className="flex text-center flex-col col-span-6 md:col-span-7">
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-0">
                                                <h2 className="text-large font-medium mt-2">{user.name}</h2>
                                                <p className="text-large font-medium mt-2">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                {/* Modulos de aprendizaje */}
                                <div className="flex text-center flex-col sm:flex-row">
                                    {/* Imagen  integracion*/}
                                    <div className=" mr-5">
                                        <Image
                                            src={getGoogleDriveImageURL('https://drive.google.com/file/d/1GmoMvai6xay3ta_cxm92Irh0yflnIw0x/view?usp=drive_link')}
                                            width={550}
                                            height={480}
                                        />
                                    </div>
                                    {/* Primera tarjeta */}
                                    <div className="mr-5">
                                        <Card className="w-[200px] py-4 bg-[#395181]">
                                            <CardBody className="overflow-visible py-2">
                                                <Image
                                                    alt="Card background"
                                                    className="object-cover rounded-xl shadow-gray-200 shadow-md cursor-pointer scale-95 transition-transform duration-300 hover:scale-105"
                                                    onClick={() => redirectTo('/modulo/capacitaciones')}
                                                    src="https://img.freepik.com/vector-premium/personas-capacitacion-empresarial-presentador-tablero-graficos_545399-1003.jpg"
                                                    width={270}
                                                    height={150}
                                                />
                                                <h4 className="text-center font-bold text-large text-white mt-3">Capacitaciones</h4>
                                            </CardBody>
                                        </Card>
                                    </div>

                                    {/* Segunda tarjeta */}
                                    <div className="text-center">
                                        <Card className="w-[200px] py-4 bg-[#395181]">
                                            <CardBody className="overflow-visible py-2">
                                                <Image
                                                    alt="Card background"
                                                    className="object-cover rounded-xl shadow-gray-200 shadow-md cursor-pointer scale-95 transition-transform duration-300 hover:scale-105"
                                                    onClick={() => redirectTo('/modulo/cursos')}
                                                    src="https://w7.pngwing.com/pngs/834/877/png-transparent-test-sat-university-education-student-checklist-miscellaneous-infographic-text-thumbnail.png"
                                                    width={270}
                                                    height={150}
                                                />
                                                <h4 className="text-center font-bold text-large text-white mt-3">Cursos</h4>
                                            </CardBody>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>No autenticado</p>  // Si no hay usuario, muestra este mensaje
                        )}
                    </CardBody>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
