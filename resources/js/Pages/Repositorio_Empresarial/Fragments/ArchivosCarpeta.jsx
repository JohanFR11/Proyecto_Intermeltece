import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
const ViewFiles = React.lazy(() => import('./ViewFiles'));
import { useDisclosure, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/react'
import { motion } from "framer-motion";

export default function Archivos({ folderID, refreshAccessToken }) {
    const [files, setListaarchivos] = useState([]);
    const [fileID, setFileId] = useState(null);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [size, setSize] = React.useState('md');

    const sizes = ["full"];
    const handleOpen = (id, size) => {
        setSize(size)
        setFileId(id);
        onOpen();
    }

    const listaArchivos = async () => {
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
            const response = await axios.get(`https://internal.meltec.com.co/empresarial/lista/${folderID}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            setListaarchivos(response.data.files || []);
        } catch (error) {
            console.error('Error al listar archivos:', error);
        }
    };

    useEffect(() => {
        if (folderID) {
            listaArchivos();
        }
    }, [folderID]); // Se actualiza cada vez que folderID cambie

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
            className="p-4 bg-gray-200 rounded-lg shadow-lg mt-10"
        >
            <Table aria-label="Example static collection table">
                <TableHeader>
                    <TableColumn className="text-center">Archivo</TableColumn>
                    <TableColumn className="text-center">/</TableColumn>
                </TableHeader>
                {files ? (
                    <TableBody>
                        {files.length > 0 ? (
                            files.map((item, index) => (
                                <TableRow key={index} className="text-center">
                                    <TableCell className="text-sm p-1">{item.file_name}</TableCell>
                                    <TableCell>{sizes.map((size) => (<button className="py-3 px-4 text-center w-[60px] bg-[#395181] rounded-xl text-white ml-3 duration-200 hover:bg-[#4c6baa] " onClick={() => handleOpen(item.id, size)} > Ver </button>))}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell>No see encontraron</TableCell>
                                <TableCell>archivos en esta carpeta</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                ) : (
                    <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
                )}
            </Table>
            <div>
                {fileID && (
                    <Suspense fallback={<p className="text-gray-500">Cargando archivos...</p>}>
                        <ViewFiles size={size} open={isOpen} close={onClose} fileID={fileID} refreshAccessToken={refreshAccessToken} />
                    </Suspense>
                )}
            </div>
        </motion.div>
    );
}
