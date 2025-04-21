import React, { useEffect } from "react";
import Flecha from "../Img/izquierda.png";
import { motion } from "framer-motion";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Checkbox } from "@heroui/react";
import ImagenUno from '../Img/signo.png';
import PDF from '../Img/pdf.png';
import axios from "axios";

export default function Principal({ accion, refreshAccessToken }) {

    const [data, setData] = React.useState([]);

    const accionderegreso = () => {
        accion();
    }

    const DocsFirmados = async () => {
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
            const response = await axios.get('http://127.0.0.1:8000/director/documentos-firmados', {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            const map = new Map();

            response.data.files.forEach((item) => map.set(item.folder_id, { ...item }));

            response.data.folders.forEach((item) => {
                if (map.has(item.id)) {
                    map.get(item.id).folder_id = item.id;
                } else {
                    map.set(item.id, { ...item })
                }
            });

            const resultado = Array.from(map.values());
            setData(resultado);
            console.log(resultado);

        } catch (error) {
            console.error("Error al generar PDF:", error.response ? error.response.data : error.message);
        }
    }

    useEffect(() => {
        DocsFirmados();
    }, []);


    const handleAutorizar = async (estado,area,id_folder,id_file,email) => {
        try {

            const DataNueva = {
                estado: estado,
                area: area,
                id_folder: id_folder,
                id_file: id_file,
                email: email,
            }

            const response = await axios.post('http://127.0.0.1:8000/director/actualizar_estados',DataNueva,{
                headers: {
                    "Content-Type": "application/json",
                }
            });

            alert('Estado actualizado correctamente.');

            window.location.reload();

        } catch (error) {
            console.error("Error al generar PDF:", error.response ? error.response.data : error.message);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7 }}
        >
            <div className="flex items-center justify-start mt-4 mb-4 ml-4 mr-4 p-5">
                <img src={Flecha} alt="Flecha" className="w-[43px] h-[43px] cursor-pointer" onClick={accionderegreso} /> 
                <p>¡Regresar!</p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center">
                <h1 className="m-6 flex items-center justify-center"><strong> Estado documentos firmados </strong></h1>
                <img src={ImagenUno} className="w-[55px] h-[55px]" />
            </div>
            <div className="mt-12">
                {data.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableColumn>Area</TableColumn>
                            <TableColumn>Decumento</TableColumn>
                            <TableColumn>Habilitar Lista</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {data.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.folder_name}</TableCell>
                                    <TableCell>
                                        <img src={PDF} className="w-[25px] h-[25px]" /> {item.file_name || 'Sin cargar'} {item.file_name && (<a href={`https://drive.google.com/file/d/${item.id}/view?usp=drive_link`} target="_blank" rel="noopener noreferrer"><button className="bg-[#395181] text-white ml-2 p-1 rounded">ver</button></a>)}
                                    </TableCell>
                                    <TableCell>
                                        <Checkbox className="mr-3" onClick={() => handleAutorizar(true, item.folder_name, item.folder_id, item.id, item.owner)}>Si</Checkbox>
                                        <Checkbox onClick={() => handleAutorizar(false, item.folder_name, item.folder_id, item.id, item.owner)}>No</Checkbox>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Table>
                        <TableBody emptyContent={"No hay archivos para mostrar."}>{[]}</TableBody>
                    </Table>
                )}

            </div>
        </motion.div>
    )
} 