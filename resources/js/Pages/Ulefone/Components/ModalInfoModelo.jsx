import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import React, { useState, useEffect } from 'react';

export default function ModalDataModelo({ open, close, modeloUlefone }) {

    const [DatosModelo, setDatosModelo] = useState(false);

    const HandelModalDateModelo = async (modelo) => {
        console.log(modelo)
        setDatosModelo([]);
        try {
            const response = await axios.get(`/ulefone/datosmodelo/${modelo}`);
            console.log('necesito', response.data.DatosModelo)
            setDatosModelo(response.data.DatosModelo); // Establecer comentarios desde la base de datos
        } catch (error) {
            console.error("Error al cargar los datos del modelo", error.response ? error.response.data : error.message);
        }
    }

    useEffect(() => {
        if (open && modeloUlefone) {  // Verifica si el modal está abierto y si modeloUlefone tiene valor
            HandelModalDateModelo(modeloUlefone); // Llamar a la función para cargar los datos
        }
    }, [open, modeloUlefone])

    console.log(DatosModelo)

    return (
        <Modal isOpen={open} onClose={close}>
            <ModalContent className="bg-white rounded-lg shadow-xl p-8">
                <ModalHeader className="text-lg font-semibold text-center text-gray-800">Especificaciones del Modelo Ulefone</ModalHeader>
                <ModalBody className="max-h-[70vh] overflow-y-auto">
                    <div className="mb-6 flex flex-wrap gap-4 justify-between items-center text-center">
                        <p className='text-center text-lg'>
                            {modeloUlefone}
                        </p>

                        {/* Verificar si los datos del modelo están disponibles */}
                        {DatosModelo ? (
                            <div>
                                <div>
                                    {DatosModelo && DatosModelo.length > 0 ? (
                                        <div>
                                            {DatosModelo.map((propiedad, index) => (
                                                <Table key={index} className='text-center text-lg'>
                                                    <TableHeader className='text-center'>
                                                        <TableColumn>TIPO</TableColumn>
                                                        <TableColumn>ESPECIFICAIÓN</TableColumn>
                                                    </TableHeader>
                                                    <TableBody className='text-center'>
                                                        <TableRow key="1" className='text-center'>
                                                            <TableCell>Categoria: </TableCell>
                                                            <TableCell>{propiedad.CATEGORIA}</TableCell>
                                                        </TableRow>
                                                        <TableRow key="2" className='text-center'>
                                                            <TableCell>Descripcion: </TableCell>
                                                            <TableCell>{propiedad.DESCRIPCION}</TableCell>
                                                        </TableRow>
                                                        <TableRow key="3" className='text-center'>
                                                            <TableCell> Network: </TableCell>
                                                            <TableCell>{propiedad.NETWORK}</TableCell>
                                                        </TableRow>
                                                        <TableRow key="4" className='text-center'>
                                                            <TableCell>Screen: </TableCell>
                                                            <TableCell>{propiedad.SCREEN}</TableCell>
                                                        </TableRow>
                                                        <TableRow key="5" className='text-center' >
                                                            <TableCell>Chipset: </TableCell>
                                                            <TableCell>{propiedad.CHIPSET}</TableCell>
                                                        </TableRow>
                                                        <TableRow key="6" className='text-center'>
                                                            <TableCell>OS: </TableCell>
                                                            <TableCell>{propiedad.OS}</TableCell>
                                                        </TableRow>
                                                        <TableRow key="7" className='text-center'>
                                                            <TableCell>RAM: </TableCell>
                                                            <TableCell>{propiedad.RAM}</TableCell>
                                                        </TableRow>
                                                        <TableRow key="8" className='text-center'>
                                                            <TableCell>ROM: </TableCell>
                                                            <TableCell>{propiedad.ROM}</TableCell>
                                                        </TableRow>
                                                        <TableRow key="9" className='text-center'>
                                                            <TableCell>Front camera: </TableCell>
                                                            <TableCell>{propiedad.FRONT_CAMERA}</TableCell>
                                                        </TableRow>
                                                        <TableRow key="10" className='text-center'>
                                                            <TableCell>Rear camera: </TableCell>
                                                            <TableCell>{propiedad.REAR_CAMERA}</TableCell>
                                                        </TableRow>
                                                        <TableRow key="11" className='text-center'>
                                                            <TableCell>Battery: </TableCell>
                                                            <TableCell>{propiedad.BATTERY}</TableCell>
                                                        </TableRow>
                                                        <TableRow key="12" className='text-center'>
                                                            <TableCell>Fingerprint sensor: </TableCell>
                                                            <TableCell>{propiedad.FINGERPRINT_SENSOR}</TableCell>
                                                        </TableRow>
                                                        <TableRow key="13" className='text-center'>
                                                            <TableCell>wireless charging: </TableCell>
                                                            <TableCell>{propiedad.WIRELESS_CHARGING}</TableCell>
                                                        </TableRow>
                                                        <TableRow key="14" className='text-center'>
                                                            <TableCell>NFC: </TableCell>
                                                            <TableCell>{propiedad.NFC}</TableCell>
                                                        </TableRow>
                                                        <TableRow key="15" className='text-center'>
                                                            <TableCell>Colors: </TableCell>
                                                            <TableCell>{propiedad.COLORS}</TableCell>
                                                        </TableRow>
                                                        <TableRow key="16" className='text-center'>
                                                            <TableCell>Frecuencia Cotizacion: </TableCell>
                                                            <TableCell>{propiedad.FRECUENCIA_COTIZACION}</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            ))}
                                        </div>
                                    ) : (
                                        <Table>
                                            <TableHeader>
                                                <TableColumn>TIPO</TableColumn>
                                                <TableColumn>ESPECIFICAIÓN</TableColumn>
                                            </TableHeader>
                                            <TableBody emptyContent={"No hay propiedades disponibles"}>{[]}</TableBody>
                                        </Table>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p>Cargando datos...</p>
                        )}
                    </div>
                </ModalBody>
                <ModalFooter className="flex justify-between">
                    <Button color="danger" variant="light" onPress={close} className="w-full sm:w-auto">
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    );
}