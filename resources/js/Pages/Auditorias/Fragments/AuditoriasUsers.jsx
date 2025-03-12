import React, { useState, useRef } from "react";
import { SnackbarProvider, useSnackbar } from 'notistack';

export default function AuditoriasUsers({ refreshAccessToken, subFolderId }) {


    console.log(subFolderId)

    const [file, setFile] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const { enqueueSnackbar } = useSnackbar();

    // Función para manejar el cambio de archivo
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size > 0) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const showToast = () => {
        console.log("Toast se está ejecutando");
        enqueueSnackbar('Añade un archivo para realizar esta accion.', {
            variant: 'warning',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center'
            },
            autoHideDuration: 2100,
            style: {
                fontSize: 17,
                color: 'rgb(0, 0, 0)',
                marginTop: 30,
                background: 'rgba(255, 238, 0, 0.52)',
            }
        });
    };

    const ErrorTocken1 = () => {
        console.log("Toast se está ejecutando");
        enqueueSnackbar('No se pudo obtener un token válido.', {
            variant: 'error',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center'
            },
            autoHideDuration: 2100,
            style: {
                fontSize: 17,
                color: 'rgb(255, 255, 255)',
                marginTop: 30,
                background: 'rgba(255, 0, 0, 0.52)',
            }
        });
    };

    // Función para subir el archivo
    const handleFileUpload = async () => {
        if (!file) {
            showToast();
            return;
        }

        const refreshToken = localStorage.getItem('refresh_token');
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
                    ErrorTocken1();
                    return;
                }
            } catch (error) {
                alert('Error al renovar el token: ' + error.message);
                return;
            }
        }
    
        setIsUploading(true);
        
        /* setUploadStatus('Subiendo archivo...'); */
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `https://internal.meltec.com.co/upload-file/${subFolderId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                    refresh_token: refreshToken
                }
            );

            if (response.data.success) {
                enqueueSnackbar(`Archivo subido con éxito: ${response.data.name}`, {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    autoHideDuration: 2100,
                    style: {
                        fontSize: 17,
                        color: 'rgb(0, 0, 0)',
                        marginTop: 30,
                        background: 'rgba(65, 255, 23, 0.52)',
                    }
                });
                window.location.reload();
            } else {
                enqueueSnackbar(`Error al subir el archivo: ${response.data.error}`, {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center'
                    },
                    autoHideDuration: 2100,
                    style: {
                        fontSize: 17,
                        color: 'rgb(0, 0, 0)',
                        marginTop: 30,
                        background: 'rgba(255, 20, 20, 0.52)',
                    }
                });
            }
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            enqueueSnackbar('Error al subir el archivo.', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                },
                autoHideDuration: 2100,
                style: {
                    fontSize: 17,
                    color: 'rgb(0, 0, 0)',
                    marginTop: 30,
                    background: 'rgba(255, 20, 20, 0.52)',
                }
            });
        }finally {
            setIsUploading(false); // Termina la carga
        }
    };

    return (
        <SnackbarProvider maxSnack={3}>
            <div className="flex flex-col items-center">
                <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
                <button
                    onClick={() => fileInputRef.current.click()}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none mb-3"
                >
                    Seleccionar archivo
                </button>

                {/* Contenedor fijo para el nombre del archivo */}
                <div className="min-h-[40px] flex items-center justify-center">
                    {fileName && (
                        <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-lg">
                            <span className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap text-gray-700">
                                {fileName}
                            </span>
                            <button
                                onClick={handleRemoveFile}
                                className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
                            >
                                X
                            </button>
                        </div>
                    )}
                </div>

                <button
                    className={`px-6 py-3 text-white rounded-lg mt-3 ${
                        isUploading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
                    }`}
                    onClick={handleFileUpload}
                    disabled={isUploading}
                >
                    Subir archivo
                </button>
            </div>
        </SnackbarProvider>
    )
}