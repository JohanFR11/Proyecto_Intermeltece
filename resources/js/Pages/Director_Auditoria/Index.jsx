import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Select, SelectItem } from "@heroui/react";
import { SnackbarProvider, useSnackbar } from 'notistack';

const Index = ({ auth, unreadNotifications, data }) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [estadoMode, setEstado] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

    const openModal = async (file) => {
        setSelectedFile(file);
        setComments([]); // Asumimos que cada archivo puede tener comentarios
        setIsModalOpen(true);

        try {
            const response = await axios.get(`https://internal.meltec.com.co/director/comentarios/${file}`);
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

    /* Toma el textarea del comentario */
    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleEstadoChange = (fileid, estado, correo,usuario,doc_c) => {
        console.log("Nuevo valor seleccionado:", fileid);
        console.log("Nuevo valor seleccionado:", estado);
        setEstado(prevState => ({
            ...prevState,
            [fileid]: { estado, correo, usuario, doc_c }
        }));
    };

    const handleCommentBBDD = async () => {
        try {
            const now = new Date();

            // Extraer las part es de la fecha
            const year = now.getFullYear(); // Año
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
            console.log(formattedDate);

            const fileId = selectedFile;
            console.log(fileId)

            await axios.post('/director/comentarios', { comentario: comment, fecha: formattedDate, file_id: fileId }, {
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

    const handleEstadoBBDD = async () => {
        
        setIsUploading(true);
        
        try {

            const estadoData = Object.entries(estadoMode).map(([id, data]) => ({
                id_doc: id,
                estado_audi: data.estado,
                correo_user: data.correo,
                usuario: data.usuario,
                doc_cargado: data.doc_c,
            }));

            await axios.post('/director/estados', { estados: estadoData }, {
                headers: { 'Content-Type': 'application/json' },
            }).then(response => {
                console.log(response.data);
                alert(response.data.message)
            }).catch(error => {
                console.error("Error al enviar el estado:", error);
            });

        } catch (error) {
            console.error("Error al ingreasar el estado:", error);
            alert(error)
        }finally {
            setIsUploading(false); // Termina la carga
        }
    }

    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Director de Auditoria</h2>
            }>
            <div className="bg-white mt-4 mb-4 ml-4 mr-4 p-5">
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
                    {data ? (
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((file, index) => (
                                    <TableRow className='text-center' key={index}>
                                        <TableCell>{file.id_documento}</TableCell>
                                        <TableCell>{file.usuario}</TableCell>
                                        <TableCell>{file.correo}</TableCell>
                                        <TableCell>{file.area_usuario}</TableCell>
                                        <TableCell>{file.documento}</TableCell>
                                        <TableCell><a
                                            href={`https://drive.google.com/file/d/${file.archivo_id}/view?usp=drive_link`} // Asegúrate de tener 'url' en el objeto 'file'
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {file.documento_cargado}
                                        </a></TableCell>
                                        <TableCell>{file.fecha_cargue}</TableCell>
                                        <TableCell><button className='bg-[#395181] text-white p-2 rounded-lg border border-separate cursor-pointer transition duration-250 ease-in-out hover:-translate-y-2 hover:scale-11 hover:bg-[#5b80ca]' onClick={() => openModal(file.archivo_id)}>Ver Observaciones</button></TableCell>
                                        <TableCell>
                                            <Select
                                                className="max-w-xs"
                                                label="Estado"
                                                placeholder="Selecciona un estado"
                                                value={estadoMode[file.id_documento] || ""} // Asegúrate de que esté vinculado al estado
                                                onChange={(e) => handleEstadoChange(file.id_documento, e.target.value, file.correo, file.usuario, file.documento_cargado)} // Actualiza el estado correctamente
                                            >
                                                <SelectItem key={"Completo"}>Completo</SelectItem>
                                                <SelectItem key={"Incompleto"}>Incompleto</SelectItem>
                                            </Select>
                                        </TableCell>
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
                <button
                    type="submit"
                    onClick={handleEstadoBBDD}
                    disabled={isUploading}
                    className={`mt-5 px-4 py-2 text-white rounded transition ${
                                isUploading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                            }`}

                >
                    Actualizar
                </button>
            </div>

            {isModalOpen && selectedFile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                        <h2 className="text-xl font-bold mb-4">Observaciones del director de auditoria</h2>

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
                                Agregar observación
                            </button>
                        </form>

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
        </AuthenticatedLayout>
    )
}

export default Index;