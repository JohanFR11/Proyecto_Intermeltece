import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@nextui-org/react";

function DocumentList({ refreshAccessToken }) {
    const [listedFiles, setListedFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null); // Estado para el archivo seleccionado
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
    const [comment, setComment] = useState(""); // Estado para el comentario ingresado
    const [comments, setComments] = useState([]); // Estado para los comentarios del archivo seleccionado

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
            const response = await axios.post('http://127.0.0.1:8000/list-files',
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

    const getFileIcon = (mimeType) => {
        // Puedes personalizar los íconos según el tipo de archivo
        if (mimeType.includes('pdf')) {
            return '📄';
        } else if (mimeType.includes('image')) {
            return '🖼️';
        } else if (mimeType.includes('spreadsheet')) {
            return '📊';
        } else if (mimeType.includes('document')) {
            return '📝';
        }
        return '📁';
    };

    const openModal = async (file) => {
        setSelectedFile(file);
        setComments([]); // Asumimos que cada archivo puede tener comentarios
        setIsModalOpen(true);

        try {
            const response = await axios.get(`http://127.0.0.1:8000/comentarios/${file.id}`);
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

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentBBDD = async () => {
        try {
            const now = new Date();

            // Extraer las partes de la fecha
            const year = now.getFullYear(); // Año
            const month = String(now.getMonth() + 1).padStart(2, '0'); 
            const day = String(now.getDate()).padStart(2, '0'); 
            const hours = String(now.getHours()).padStart(2, '0'); 
            const minutes = String(now.getMinutes()).padStart(2, '0'); 
            const seconds = String(now.getSeconds()).padStart(2, '0'); 
            const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
            console.log(formattedDate);

            const fileId = selectedFile?.id;
            console.log(fileId)

            await axios.post('/comentarios', { comentario: comment, fecha: formattedDate, file_id: selectedFile.id}, {
                headers: { 'Content-Type': 'application/json' },
            }).then(response => {
                console.log(response.data);
            }).catch(error => {
                console.error("Error al enviar los datos:", error);
            });

        } catch (error) {
            console.error("Error al ingreasar los datos de comentarios:", error);
        }
    }

    return (
        <div>
            {/* Lista de archivos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                {listedFiles.map((file, index) => (
                    <div
                        key={index}
                        className="border rounded-lg p-4 shadow hover:shadow-lg transition-shadow"
                    >
                        {/* Vista previa o ícono */}
                        <div className="aspect-square mb-2">
                            {file.thumbnailLink ? (
                                <img
                                    src={file.thumbnailLink}
                                    alt={file.file_name}
                                    className="w-full h-full object-cover rounded"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-100 rounded">
                                    {getFileIcon(file.mimeType)}
                                </div>
                            )}
                        </div>

                        {/* Nombre del archivo */}
                        <h3 className="font-medium truncate">{file.file_name}</h3>

                        {/* Botones de acción */}
                        <div className="mt-2 flex gap-2">
                            <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                            >
                                Ver
                            </a>
                            <button
                                onClick={() => window.open(file.webViewLink, '_blank')}
                                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                            >
                                Descargar
                            </button>
                            <button
                                onClick={() => openModal(file)} // Abre el modal con el archivo seleccionado
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                            >
                                Comentar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && selectedFile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                        <h2 className="text-xl font-bold mb-4">{selectedFile.file_name}</h2>

                        {/* Formulario para agregar comentarios */}
                        <form onSubmit={handleCommentBBDD} className="mt-4">
                            <textarea
                                value={comment}
                                onChange={handleCommentChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
                                placeholder="Escribe tu comentario..."
                                rows="4"
                            ></textarea>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                Agregar comentario
                            </button>
                        </form>

                        {/* Mostrar comentarios */}
                        <div className="mt-4" style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                            <h3 className="font-bold mb-2">Comentarios:</h3>
                            <ul className="space-y-4">
                                {comments.map((comment, index) => (
                                    <li key={index} className="p-4 border border-gray-300 rounded-md">
                                        <p>{comment.comentario}</p>
                                        <small className="text-gray-500">{comment.create_time}</small>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Cerrar el modal */}
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
