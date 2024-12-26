import { useEffect, useState } from 'react';
import axios from 'axios';


function DocumentList({ onRefreshAccessToken }) {
    const [listedFiles, setListedFiles] = useState([]);

    const listFiles = async () => {

        let token;
        const tokenExpiry = 3599;

        // Verificar si el token está vencido
        const isTokenExpired = tokenExpiry && Date.now() > parseInt(tokenExpiry, 10);

        if (!token || isTokenExpired) {
            // Si no hay token o está vencido, intentar refrescarlo
            try {
                await onRefreshAccessToken(); // Refrescar el token
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

    return (
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
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DocumentList;