import axios from "axios";
import React, { useEffect, useState, Suspense} from "react";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@heroui/table";
import { motion } from "framer-motion";
const FirmaUsuario = React.lazy(() => import("./firmausuario"));

export default function InfoUser({ name, refreshAccessToken }) {
    const [mostrarFirma, setMostrarFirma] = useState(false);
    const [firmaBase64, setFirmaBase64] = useState(null);
    const [kpisIde, setKpisIde] = useState([]);
    const [folderID, setIdFolder] = useState('');
    /* const [mostrarTodo, setMostrarTodo] = useState(() => {
        // Obtener el estado almacenado en localStorage
        return localStorage.getItem("finalizado") !== "true";
    }); */
    const [mostrarTodo, setMostrarTodo] = useState(true); // Nuevo estado para ocultar todo después de finalizar
    const [mostrarPrevisualizacion, setMostrarPrev] = useState(false); // Nuevo estado para ocultar todo después de finalizar
    const [datos, setDatos] = useState([]);// Nuevo estado para ocultar todo después de finalizar

    const listarKpis = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/KpisUser/kpis/${name}`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            setKpisIde(response.data.kpisuser);
        } catch (error) {
            console.error('Error al obtener los kpis:', error);
        }
    };

    useEffect(() => {
        if (name) {
            listarKpis();
        }
    }, [name]);

    const handleGuardarFirma = (firma) => {
        setFirmaBase64(firma);
        setMostrarFirma(false);
    };

    const generarPDF = async (data) => {
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
            const dataConFirma = {
                ...data,
                firma: firmaBase64
            };

            console.log(dataConFirma);

            const response = await axios.post('/firma/kpis', dataConFirma, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(response.data.mensaje);
            console.log(response.data.Superior);

            setIdFolder(response.data.folder_id);
            // Ocultar todo excepto la tabla después de finalizar
            setMostrarTodo(false);

        } catch (error) {
            console.error("Error al generar PDF:", error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        const obtenerPrevisualizacion = async () => {
            if (!folderID) return; // Si folderID no está definido, no hacer nada

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
                const response = await axios.get(`http://127.0.0.1:8000/mostrar/${folderID}`, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    }
                });

                setDatos(response.data.files);
                setMostrarPrev(true);
            } catch (error) {
                console.error("Error al generar PDF:", error.response ? error.response.data : error.message);
            }
        };

        obtenerPrevisualizacion();
    }, [folderID]);

    const id_user = kpisIde.length > 0 ? kpisIde[0].identificacion_empleado : null;

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.7 }}
                className="p-4 bg-gray-200 rounded-lg shadow-lg mt-10 overflow-x-auto"
            >
                <Table aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn className="text-center">Identificación</TableColumn>
                        <TableColumn className="text-center">Correo</TableColumn>
                        <TableColumn className="text-center">Nombre Indicado</TableColumn>
                        <TableColumn className="text-center">Descripción KPI</TableColumn>
                        <TableColumn className="text-center">Peso Objetivo</TableColumn>
                    </TableHeader>
                    {kpisIde ? (
                        <TableBody>
                            {kpisIde.length > 0 ? (
                                kpisIde.map((item, index) => (
                                    <TableRow key={index} className="text-center">
                                        <TableCell className="text-sm text-center p-2">{item.identificacion_empleado}</TableCell>
                                        <TableCell className="text-sm text-center p-2">{item.correo_empleado}</TableCell>
                                        <TableCell className="text-sm text-center p-2">{item.nombre_indicado}</TableCell>
                                        <TableCell className="text-sm text-center p-2">{item.descripcion_kpi}</TableCell>
                                        <TableCell className="text-sm text-center p-2">{item.peso_objetivo}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell className="text-center">No se encontró información de KPIs</TableCell>
                                    <TableCell className="text-center">No se encontró información de KPIs</TableCell>
                                    <TableCell className="text-center">No se encontró información de KPIs</TableCell>
                                    <TableCell className="text-center">No se encontró información de KPIs</TableCell>
                                    <TableCell className="text-center">No se encontró información de KPIs</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    ) : (
                        <TableBody emptyContent={"No rows to display."}>{[]}</TableBody>
                    )}
                </Table>

                {mostrarTodo && (
                    <>
                        <button onClick={() => setMostrarFirma(true)} className="mt-5 p-3 rounded-lg text-center text-white bg-[#395181] duration-150 hover:bg-[#4c6dad]">
                            Firmar
                        </button>

                        {mostrarFirma && (<Suspense fallback={<div>Cargando firma...</div>}><FirmaUsuario id_user={id_user} onSave={handleGuardarFirma} onClose={() => setMostrarFirma(false)} /></Suspense>)}

                        {firmaBase64 && (
                            <div className="mt-4 flex flex-col items-center">
                                <h3>Firma Guardada:</h3>
                                <img src={firmaBase64} alt="Firma" className="border-white border-1" />
                            </div>
                        )}

                        {firmaBase64 && (
                            <button className="mt-5 p-3 rounded-lg text-center text-white bg-[#395181] duration-150 hover:bg-[#4c6dad]"
                                onClick={() => generarPDF(kpisIde)}>
                                Finalizar
                            </button>
                        )}
                    </>
                )}

                {mostrarPrevisualizacion && (
                    <div className="flex itme-center justify-center mt-4">
                        {Array.isArray(datos) && datos.length > 0 ? (
                            datos.map((item, index) => (
                                <img className="rounded-lg" key={index} src={item.thumbnailLink} />
                            ))
                        ) : (
                            <div>No se encuentran carpetas disponibles</div>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
