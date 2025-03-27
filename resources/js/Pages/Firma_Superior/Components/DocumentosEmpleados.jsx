import React, { useEffect, useState, Suspense } from "react";
import { Card, CardFooter, CardBody, Image, useDisclosure, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/react";
const Preview = React.lazy(() => import('../Fragments/preview'));
const FirmaSuperior = React.lazy(() => import('../Fragments/firmasuperior'));
import axios from 'axios';

export default function DocEmpleados({ refreshAccessToken, name, statusFile }) {

    const [file, setFile] = useState([]); // Nuevo estado para ocultar todo después de finalizar
    const [folder, setFolder] = useState([]); // Nuevo estado para ocultar todo después de finalizar

    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);

    const [size, setSize] = React.useState('md');
    const [fileID, setFileId] = useState(null);

    const [mostrarFirma, setMostrarFirma] = useState(false);
    const [firmas, setFirmas] = useState({});

    const sizes = ["full"];
    const handleOpen = (id, size) => {
        /* console.log(modelo) */
        setSize(size)
        setFileId(id);
        onOpen();
    }

    const handleGuardarFirma = (archivoId, firma) => {
        setFirmas((prevFirmas) => ({
            ...prevFirmas,
            [archivoId]: firma, // Guardar la firma específica del archivo
        }));
        setMostrarFirma(false); // Cerrar la firma una vez guardada
    };

    const handlearchivos = async () => {

        let token = localStorage.getItem('access_token');
        const tokenExpiry = 3599;

        // Verificar si el token está vencido
        const isTokenExpired = tokenExpiry && Date.now() > parseInt(tokenExpiry, 10);

        if (!token || isTokenExpired) {
            await refreshAccessToken();
            token = localStorage.getItem('access_token');
        }

        if (!token) {
            console.error('No se pudo obtener un token válido.');
            return;
        }

        const newdata = {
            name_super: name,
        }

        try {
            const response = await axios.post(`http://127.0.0.1:8000/superior/kpis/documentos`, newdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setFolder(response.data.folders);
            setFile(response.data.files);

        } catch (error) {
            console.error('Error al obtener los kpis:', error);
        }
    }

/*     const nombre = folder.map((item) => item.folder_name);

    const identificacion = nombre.map((name) => name.match(/\d+/g)?.join("") || ""); */


    const handleFiledit = async (archivo_id,folder_id, folder_name) => {

        let token = localStorage.getItem('access_token');
        const tokenExpiry = 3599;

        // Verificar si el token está vencido
        const isTokenExpired = tokenExpiry && Date.now() > parseInt(tokenExpiry, 10);

        if (!token || isTokenExpired) {
            await refreshAccessToken();
            token = localStorage.getItem('access_token');
        }

        if (!token) {
            console.error('No se pudo obtener un token válido.');
            return;
        }
        try {

            const identificacion = folder_name.replace(/\D+/g,"");
            console.log(identificacion)
            console.log(folder_id)
            console.log(folder_name)

            const firmaArchivo = firmas[archivo_id];
            const dataConFirma = {
                id_archivo: folder_id,
                id_user: identificacion,
                firma_superior: firmaArchivo
            };

            const response = await axios.post('http://127.0.0.1:8000/superior/kpis/firmar_documentos', dataConFirma, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(response.data.mensaje);
            console.log(response.data.Superior);

            window.location.reload();

            estado({ estado: false, estado_prev: true, nombre: name, file: archivo_id });

        } catch (error) {
            console.error('Error al obtener los kpis:', error);
        }
    };

    useEffect(() => {
        handlearchivos();
    }, []);

    const estado = async ({ estado, estado_prev, nombre, file }) => {

        const newstate = {
            estado: estado,
            estado_vista: estado_prev,
            nombre_empleado: nombre,
            file_id: file,
        }

        try {
            await axios.post('http://127.0.0.1:8000/actualizar-estado/superior', newstate, {
                headers: {
                    "Content-Type": "application/json",
                }
            });

        } catch (error) {
            console.error("Error al generar PDF:", error.response ? error.response.data : error.message);
        }
    }

    return (
        <div className="m-4">
            {folder.length > 0 ? (
                <Table aria-label="Lista de Kpi's">
                    <TableHeader>
                        <TableColumn className="text-center">Kpi's de</TableColumn>
                        <TableColumn className="text-center">Acciones</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {folder.map((fodlers) => {
                            const filesfolder = file.filter((item) => {
                                const folderId = item.folder_id;
                                return folderId === fodlers.id;
                            });

                            return filesfolder.length > 0 ? (
                                filesfolder.map((files) => {

                                    const filesStatus = statusFile.filter((item) => {
                                        const idcomparation = item.folder_id;
                                        console.log(idcomparation)
                                        return idcomparation === files.id
                                    });
                                    console.log('filestatus', filesStatus)
                                    return (
                                        <TableRow key={files.id} className="text-center">
                                            <TableCell className="text-sm text-center p-2">{fodlers.folder_name}</TableCell>
                                            <TableCell className="text-sm text-center p-2">
                                                <button
                                                    className="p-3 text-center bg-[#395181] rounded-xl text-white duration-200 hover:bg-[#4c6baa] mr-2"
                                                    onClick={() => handleOpen(files.id, sizes)}
                                                >
                                                    Ver
                                                </button>
                                                {filesStatus.length === 0 || !filesStatus.every((status) => status.folder_id === files.id) ? (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setFirmas((prev) => ({ ...prev, [files.id]: null }));
                                                                setFileId(files.id);
                                                                setMostrarFirma(true); // Mostrar firma
                                                            }}
                                                            className="mt-5 p-3 rounded-lg text-center text-white bg-[#395181] duration-150 hover:bg-[#4c6dad]"
                                                        >
                                                            Firmar
                                                        </button>

                                                        {firmas[files.id] && (
                                                            <div className="mt-4 flex flex-col items-center">
                                                                <h3>Firma Guardada:</h3>
                                                                <img src={firmas[files.id]} alt="Firma" className="border-white border-1" />
                                                            </div>
                                                        )}

                                                        {firmas[files.id] && (
                                                            <button
                                                                className="mt-5 p-3 rounded-lg text-center text-white bg-[#395181] duration-150 hover:bg-[#4c6dad]"
                                                                onClick={() => handleFiledit(files.id, files.folder_id, fodlers.folder_name)}
                                                            >
                                                                Finalizar
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <p>Firmado</p>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );

                                })
                            ) : (
                                <TableRow key={fodlers.id} className="text-center">
                                    <TableCell className="text-sm text-center p-2">{fodlers.folder_name}</TableCell>
                                    <TableCell className="text-sm text-center p-2 text-gray-500">No hay archivos</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            ) : (
                <Table>
                    <TableBody emptyContent={"No hay archivos para mostrar."}>{[]}</TableBody>
                </Table>
            )}



            {mostrarFirma && (
                <Suspense fallback={<p className="text-gray-500">Cargando firma...</p>}>
                    <FirmaSuperior onSave={(firma) => handleGuardarFirma(fileID, firma)} />
                </Suspense>
            )}

            {fileID && (
                <Suspense fallback={<p className="text-gray-500">Cargando archivos...</p>}>
                    <Preview size={size} open={isOpen} close={() => setIsOpen(false)} fileID={fileID} refreshAccessToken={refreshAccessToken} />
                </Suspense>
            )}


        </div>
    )
}