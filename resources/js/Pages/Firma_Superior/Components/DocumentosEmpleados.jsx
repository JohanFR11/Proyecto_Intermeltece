import React, { useEffect, useState, Suspense } from "react";
import { Card, CardFooter, CardBody, Image, useDisclosure, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/react";
const Preview = React.lazy(() => import('../Fragments/preview'));
const FirmaSuperior = React.lazy(() => import('../Fragments/firmasuperior'));
import axios from 'axios';

export default function DocEmpleados({ refreshAccessToken, name}) {

    const [file, setFile] = useState([]); // Nuevo estado para ocultar todo después de finalizar
    const [folder, setFolder] = useState([]); // Nuevo estado para ocultar todo después de finalizar

    const [isOpen, setIsOpen] = useState(false);

    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);

    const [size, setSize] = React.useState('md');
    const [fileID, setFileId] = useState(null);

    const [mostrarTodo, setMostrarTodo] = useState(true);
    const [mostrarFirma, setMostrarFirma] = useState(false);
    const [firmaBase64, setFirmaBase64] = useState(null);

    const sizes = ["full"];
    const handleOpen = (id, size) => {
        /* console.log(modelo) */
        setSize(size)
        setFileId(id);
        onOpen();
    }

    const handleGuardarFirma = (firma) => {
        setFirmaBase64(firma);
        setMostrarFirma(false);
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
            const response = await axios.post(`http://127.0.0.1:8000/superior/kpis/documentos`,newdata,{
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setFolder(response.data.folders);
            setFile(response.data.files);
            /* console.log(response.data.folders)
            console.log(response.data.files) */

        } catch (error) {
            console.error('Error al obtener los kpis:', error);
        }
    }

    const nombre = folder.map((item) => item.folder_name);
    const id_folder = folder.map((item) => item.id);

    console.log(id_folder);

    const identificacion = nombre.map((name) => name.match(/\d+/g)?.join("") || "");

    const handleFiledit = async () => {

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

            console.log(firmaBase64);

            const dataConFirma = {
                id_archivo: id_folder,
                id_user: identificacion,
                firma_superior: firmaBase64
            };

            const response = await axios.post('http://127.0.0.1:8000/superior/kpis/firmar_documentos', dataConFirma, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(response.data.mensaje);
            console.log(response.data.Superior);

            setMostrarTodo(false);

        } catch (error) {
            console.error('Error al obtener los kpis:', error);
        }
    };

    useEffect(() => {
        handlearchivos();
    }, []);

    console.log(file)
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
                                console.log('folderid',folderId)
                                return folderId === fodlers.id;
                            });

                            return filesfolder.length > 0 ? (
                                filesfolder.map((files) => (
                                    <TableRow key={files.id} className="text-center">
                                        <TableCell className="text-sm text-center p-2">{fodlers.folder_name}</TableCell>
                                        <TableCell className="text-sm text-center p-2">
                                            <button className="p-3 text-center bg-[#395181] rounded-xl text-white duration-200 hover:bg-[#4c6baa] mr-2"
                                                onClick={() => handleOpen(files.id, sizes)}
                                            >
                                                Ver
                                            </button>
                                            {mostrarTodo && (
                                                <>
                                                    <button onClick={() => setMostrarFirma(true)}
                                                        className="mt-5 p-3 rounded-lg text-center text-white bg-[#395181] duration-150 hover:bg-[#4c6dad]">
                                                        Firmar
                                                    </button>

                                                    {firmaBase64 && (
                                                        <div className="mt-4 flex flex-col items-center">
                                                            <h3>Firma Guardada:</h3>
                                                            <img src={firmaBase64} alt="Firma" className="border-white border-1" />
                                                        </div>
                                                    )}

                                                    {firmaBase64 && (
                                                        <button className="mt-5 p-3 rounded-lg text-center text-white bg-[#395181] duration-150 hover:bg-[#4c6dad]"
                                                            onClick={() => handleFiledit()}
                                                        >
                                                            Finalizar
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
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
                    <FirmaSuperior onSave={handleGuardarFirma} onClose={() => setMostrarFirma(false)} />
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