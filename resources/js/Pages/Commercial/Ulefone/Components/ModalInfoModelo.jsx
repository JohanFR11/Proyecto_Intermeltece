import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import { Carousel,IconButton } from "@material-tailwind/react";

export default function ModalDataModelo({ open, close, size, modeloUlefone }) {

    const [DatosModelo, setDatosModelo] = useState(false);

    const HandelModalDateModelo = async (modelo) => {
        setDatosModelo([]);
        try {
            const response = await axios.get(`/commercial/ulefone/datosmodelo/${modelo}`);
            setDatosModelo(response.data.DatosModelo); // Establecer comentarios desde la base de datos
        } catch (error) {
            console.error("Error al cargar los datos del modelo", error.response ? error.response.data : error.message);
        }
    }

    useEffect(() => {
        if (open && modeloUlefone) {  // Verifica si el modal está abierto y si modeloUlefone tiene valor
            HandelModalDateModelo(modeloUlefone); // Llamar a la función para cargar los datos
        }
    }, [open, modeloUlefone]);

    const getGoogleDriveImageURL = (driveUrl) => {
        const fileId = driveUrl.split('/d/')[1]?.split('/')[0]; // Extraer el fileId

        return `https://lh3.googleusercontent.com/d/${fileId}`; // Generar URL directa
    };
     //render segunda url img
    const getGoogleDriveImageURLSegunda = (driveUrl) => {
        const fileId = driveUrl.split('/d/')[1]?.split('/')[0]; // Extraer el fileId

        return `https://lh3.googleusercontent.com/d/${fileId}`; // Generar URL directa
    };

    //render tercera url img 
    const getGoogleDriveImageURLTercera = (driveUrl) => {
        const fileId = driveUrl.split('/d/')[1]?.split('/')[0]; // Extraer el fileId

        return `https://lh3.googleusercontent.com/d/${fileId}`; // Generar URL directa
    };

    //render cuarta url img
    const getGoogleDriveImageURLCuarta = (driveUrl) => {
        const fileId = driveUrl.split('/d/')[1]?.split('/')[0]; // Extraer el fileId

        return `https://lh3.googleusercontent.com/d/${fileId}`; // Generar URL directa
    };

    return (
        <Modal size={size} isOpen={open} onClose={close} className="inset-0 z-50 bg-black/50 backdrop-blur-sm">
            <ModalContent className="bg-white rounded-xl shadow-2xl p-3">
                <ModalHeader className="text-2xl font-bold text-center text-gray-800 border-b pb-4">
                    Especificaciones del Modelo Ulefone
                </ModalHeader>
                <ModalBody className="max-h-[70vh] overflow-y-auto p-4">
                    <div className="mb-6 flex flex-wrap gap-6 justify-center items-center">
                        <p className='text-lg font-semibold text-gray-700'>
                            {modeloUlefone}
                        </p>

                        {/* Verificar si los datos del modelo están disponibles */}
                        {DatosModelo ? (
                            <div className="w-full">
                                {DatosModelo && DatosModelo.length > 0 ? (
                                    <div className="space-y-6">
                                        {DatosModelo.map((propiedad, index) => (
                                            <div key={index} className="flex flex-row gap-6 justify-center items-center">
                                                <div className="w-full md:w-1/2 p-4">
                                                    <Table className="text-center text-xl">
                                                        <TableHeader className="bg-gray-100 text-gray-800">
                                                            <TableColumn>TIPO</TableColumn>
                                                            <TableColumn>ESPECIFICACIÓN</TableColumn>
                                                        </TableHeader>
                                                        <TableBody>
                                                            <TableRow>
                                                                <TableCell>Categoria: </TableCell>
                                                                <TableCell>{propiedad.CATEGORIA}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Descripcion: </TableCell>
                                                                <TableCell>{propiedad.DESCRIPCION}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Network: </TableCell>
                                                                <TableCell>{propiedad.NETWORK}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Screen: </TableCell>
                                                                <TableCell>{propiedad.SCREEN}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Chipset: </TableCell>
                                                                <TableCell>{propiedad.CHIPSET}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>OS: </TableCell>
                                                                <TableCell>{propiedad.OS}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>RAM: </TableCell>
                                                                <TableCell>{propiedad.RAM}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>ROM: </TableCell>
                                                                <TableCell>{propiedad.ROM}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Front camera: </TableCell>
                                                                <TableCell>{propiedad.FRONT_CAMERA}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Rear camera: </TableCell>
                                                                <TableCell>{propiedad.REAR_CAMERA}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Battery: </TableCell>
                                                                <TableCell>{propiedad.BATTERY}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Fingerprint sensor: </TableCell>
                                                                <TableCell>{propiedad.FINGERPRINT_SENSOR}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Wireless charging: </TableCell>
                                                                <TableCell>{propiedad.WIRELESS_CHARGING}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>NFC: </TableCell>
                                                                <TableCell>{propiedad.NFC}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Colors: </TableCell>
                                                                <TableCell>{propiedad.COLORS}</TableCell>
                                                            </TableRow>
                                                            <TableRow>
                                                                <TableCell>Frecuencia Cotización: </TableCell>
                                                                <TableCell>{propiedad.FRECUENCIA_COTIZACION}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                                <div className="w-full md:w-1/2 p-4">
                                                    {/* <img
                                                        className="rounded-lg shadow-lg w-[650px] h-[500px]"
                                                        src={getGoogleDriveImageURL(propiedad.URL_IMG)}
                                                        alt="Modelo Ulefone"
                                                    /> */}
                                                    <Carousel
                                                        className="rounded-xl overflow-hidden w-full h-[400px] shadow-lg drop-shadow-lg"
                                                        prevArrow={({ handlePrev }) => (
                                                            <IconButton
                                                                variant="text"
                                                                color="#00FFFF"
                                                                size="lg"
                                                                onClick={handlePrev}
                                                                className="!absolute top-2/4 left-4 -translate-y-2/4"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={2}
                                                                    stroke="currentColor"
                                                                    className="h-6 w-6"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                                                                    />
                                                                </svg>
                                                            </IconButton>
                                                        )}
                                                        nextArrow={({ handleNext }) => (
                                                            <IconButton
                                                                variant="text"
                                                                color="#00FFFF"
                                                                size="lg"
                                                                onClick={handleNext}
                                                                className="!absolute top-2/4 !right-4 -translate-y-2/4"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={2}
                                                                    stroke="currentColor"
                                                                    className="h-6 w-6"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                                                    />
                                                                </svg>
                                                            </IconButton>
                                                        )}
                                                    >
                                                        <img
                                                            src={getGoogleDriveImageURL(propiedad.URL_IMG)}
                                                            alt="image 1"
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <img
                                                            src={getGoogleDriveImageURLSegunda(propiedad.URL_IMG_dos)}
                                                            alt="image 2"
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <img
                                                            src={getGoogleDriveImageURLTercera(propiedad.URL_IMG_tres)}
                                                            alt="image 3"
                                                            className="h-full w-full object-cover"
                                                        />
                                                        <img
                                                            src={getGoogleDriveImageURLCuarta(propiedad.URL_IMG_cuatro)}
                                                            alt="image 3"
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </Carousel>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Table>
                                        <TableHeader>
                                            <TableColumn>TIPO</TableColumn>
                                            <TableColumn>ESPECIFICACIÓN</TableColumn>
                                        </TableHeader>
                                        <TableBody emptyContent={"No hay propiedades disponibles"}>{[]}</TableBody>
                                    </Table>
                                )}
                            </div>
                        ) : (
                            <p className="text-gray-500">Cargando datos...</p>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter className="flex justify-end border-t">
                    <Button
                        color="danger"
                        variant="light"
                        onPress={close}
                        className="w-full sm:w-auto"
                    >
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}