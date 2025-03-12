import React, { useEffect, useState, Suspense } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import axios from "axios";
import { motion } from "framer-motion";

const Archivos = React.lazy(() => import('../Fragments/ArchivosCarpeta'));

export default function Repo_empresarial({ refreshAccessToken }) {
    const [onlistaCarpetas, setListaCarpetas] = useState([]);
    const [folderID, setFolderID] = useState(null);
    const [loading, setLoading] = useState(false);

    const listaCarpetas = async () => {
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
            const response = await axios.get(`https://internal.meltec.com.co/empresarial/carpetas`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setListaCarpetas(response.data.folders || []);
        } catch (error) {
            console.error('Error al listar archivos:', error.response?.data || error.message);
            if (error.response?.status === 401) {
                console.warn("El token podría haber expirado. Intentando refrescar...");
                await refreshAccessToken();
                token = localStorage.getItem('access_token');
                if (token) {
                    console.log("Token actualizado, reintentando la petición...");
                    return listaCarpetas(); // Reintenta la petición con el nuevo token
                }
            }
        }
    };

    const handleFolderSelect = async (id) => {
        setLoading(true);  // Mostrar spinner
        setFolderID(id);
        setTimeout(() => setLoading(false), 2000); // Simular carga
    };


    useEffect(() => {
        listaCarpetas();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full p-4">
            <Dropdown>
                <DropdownTrigger className="border-gray-300 rounded-lg shadow-lg shadow-gray-400 cursor-pointer p-4">
                    📁 Selecciona una Carpeta Empresarial
                </DropdownTrigger>
                {onlistaCarpetas.length > 0 ? (
                    <DropdownMenu aria-label="Static Actions">
                        {onlistaCarpetas.map((item, index) => (
                            <DropdownItem key={index} onPress={() => handleFolderSelect(item.id)}>
                                {item.folder_name}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                ) : (
                    <DropdownItem>No se encuentran carpetas disponibles</DropdownItem>
                )}
            </Dropdown>

            {folderID && (
                <Suspense fallback={<p className="text-gray-500">Cargando archivos...</p>}>
                    <Archivos folderID={folderID} refreshAccessToken={refreshAccessToken} />
                </Suspense>
            )}

            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                >
                    <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white"></div>
                        <p className="text-white mt-2">Cargando...</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
