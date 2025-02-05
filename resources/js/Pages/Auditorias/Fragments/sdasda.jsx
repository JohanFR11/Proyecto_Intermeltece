import React, { useState, useRef } from "react";
import { SnackbarProvider, useSnackbar } from 'notistack';
import { CircularProgress } from '@mui/material'; // Spinner de carga
import axios from 'axios';

export default function AuditoriasUsers({ refreshAccessToken, subFolderId }) {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [isUploading, setIsUploading] = useState(false); // Estado de carga
    const fileInputRef = useRef(null);
    const { enqueueSnackbar } = useSnackbar();

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

    const showToast = (message, variant) => {
        enqueueSnackbar(message, {
            variant: variant,
            anchorOrigin: { vertical: 'top', horizontal: 'center' },
            autoHideDuration: 2100,
            style: {
                fontSize: 17,
                color: variant === 'error' ? 'white' : 'black',
                marginTop: 30,
                background: variant === 'error' ? 'rgba(255, 0, 0, 0.52)' : 'rgba(65, 255, 23, 0.52)',
            }
        });
    };

    const handleFileUpload = async () => {
        if (!file) {
            showToast('Añade un archivo para realizar esta acción.', 'warning');
            return;
        }

        setIsUploading(true); // Inicia la carga
        let token = localStorage.getItem('access_token');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(
                `http://127.0.0.1:8000/upload-file/${subFolderId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    }
                }
            );

            if (response.data.success) {
                showToast(`Archivo subido con éxito: ${response.data.name}`, 'success');
                window.location.reload();
            } else {
                showToast(`Error al subir el archivo: ${response.data.error}`, 'error');
            }
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            showToast('Error al subir el archivo.', 'error');
        } finally {
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
                    {isUploading ? <CircularProgress size={24} color="inherit" /> : "Subir archivo"}
                </button>
            </div>
        </SnackbarProvider>
    );
}
