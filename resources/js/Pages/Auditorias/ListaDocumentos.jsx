import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";
import { SnackbarProvider, useSnackbar } from 'notistack';

function DocumentList({ refreshAccessToken }) {
    const [listedFiles, setListedFiles] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);



    const listFiles = async () => {
        let token;
        const tokenExpiry = 3599;

        // Verificar si el token está vencido
        const isTokenExpired = tokenExpiry && Date.now() > parseInt(tokenExpiry, 10);

        if (!token || isTokenExpired) {
            // Si no hay token o está vencido, intentar refrescarlo
            try {
                await refreshAccessToken(); // Refrescar el token
                token = localStorage.getItem('access_token'); // Recuperar el nuevo access token

                if (!token) {
                    alert('No se pudo obtener un token válido.');
                    return;
                }
            } catch (error) {
                alert('Error al renovar el token: ' + error.message);
                return;
            }
        }
        try {
            const response = await axios.post('https://internal.meltec.com.co/list-files',
                {},
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (!response.data.files) {
                setListedFiles([]);
            } else {
                setListedFiles(response.data.files);
            }
        } catch (error) {
            console.error('Error al listar archivos:', error);
        }
    }

    useEffect(() => {
        listFiles();
    }, []);

    const openModal = async (file) => {
        setSelectedFile(file);
        setComments([]); // Asumimos que cada archivo puede tener comentarios
        setIsModalOpen(true);

        try {
            const response = await axios.get(`https://internal.meltec.com.co/comentarios/${file}`);
            console.log(response.data)
            setComments(response.data); // Establecer comentarios desde la base de datos
        } catch (error) {
            console.error("Error al cargar los comentarios", error.response ? error.response.data : error.message);
        }

    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFile(null);
    };

    return (
        <div>
            {/* Lista de archivos */}
            <div className="">
                <div
                    className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
                >
                    {/* Nombre del archivo */}

                    <Table aria-label="Example static collection table">
                        <TableHeader>
                            <TableColumn>ID</TableColumn>
                            <TableColumn>Usuario</TableColumn>
                            <TableColumn>Correo</TableColumn>
                            <TableColumn>Area</TableColumn>
                            <TableColumn>Documento requerido</TableColumn>
                            <TableColumn>Documento Cargado</TableColumn>
                            <TableColumn>Fecha del documento</TableColumn>
                            <TableColumn>Observaciones</TableColumn>
                            <TableColumn>Estado de auditoria</TableColumn>
                        </TableHeader>
                        {listedFiles ? (
                            <TableBody>
                                {listedFiles.length > 0 ? (
                                    listedFiles.map((file, index) => (
                                        <TableRow className='text-center' key={index}>
                                            <TableCell>{file.id_documento}</TableCell>
                                            <TableCell>{file.usuario}</TableCell>
                                            <TableCell>{file.correo}</TableCell>
                                            <TableCell>{file.area_usuario}</TableCell>
                                            <TableCell>{file.documento}</TableCell>
                                            <TableCell>{file.documento_cargado}</TableCell>
                                            <TableCell>{file.fecha_cargue}</TableCell>
                                            <TableCell><button className='bg-[#395181] text-white p-2 rounded-lg border border-separate cursor-pointer transition duration-250 ease-in-out hover:-translate-y-2 hover:scale-11 hover:bg-[#5b80ca]' onClick={()=> openModal(file.archivo_id)}>Ver Observaciones</button></TableCell>
                                            <TableCell>{file.estado_auditoria}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell className="text-center">No se encuentran docuemntos</TableCell>
                                        <TableCell className="text-center">No se encuentran docuemntos</TableCell>
                                        <TableCell className="text-center">No se encuentran docuemntos</TableCell>
                                        <TableCell className="text-center">No se encuentran docuemntos</TableCell>
                                        <TableCell className="text-center">No se encuentran docuemntos</TableCell>
                                        <TableCell className="text-center">No se encuentran docuemntos</TableCell>
                                        <TableCell className="text-center">No se encuentran docuemntos</TableCell>
                                        <TableCell className="text-center">No se encuentran docuemntos</TableCell>
                                        <TableCell className="text-center">No se encuentran docuemntos</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        ) : (
                            <p>Cargando archivos ...</p>
                        )}
                    </Table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedFile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                        <h2 className="text-xl font-bold mb-4">Observaciones del director de auditoria</h2>
                        <div className="mt-4" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                            <h3 className="font-bold mb-2">Observaciones:</h3>
                            <ul className="space-y-4">
                                {comments.map((comment, index) => (
                                    <li key={index} className="p-4 border border-gray-300 rounded-md">
                                        <p>{comment.comentario}</p>
                                        <small className="text-gray-500">{comment.fecha_comentario}</small>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            onClick={closeModal}
                            className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DocumentList;
