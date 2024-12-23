import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Alert } from "@nextui-org/react";
import { Toast } from 'primereact/toast';

const GoogleDriveUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('Esperando archivo...');
  const [accessToken, setAccessToken] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);
  const toastCenter = useRef(null);  // Referencia al componente Toast

  // Función para redirigir al usuario para autenticarse
  const handleAuthClick = async () => {
    const clientId = '714516731386-9av4nplhrj4ssu4j79psumo7pur8unpl.apps.googleusercontent.com';
    const redirectUri = 'http://127.0.0.1:8000/auditoria';  // URL donde el usuario es redirigido después de autenticarse
    const scope = 'https://www.googleapis.com/auth/drive.file';

    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&access_type=offline&prompt=consent&scope=${scope}`;
    window.location.href = authUrl;
  };

  // Función para extraer el access_token de la URL
  const extractTokenFromUrl = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      try {
        // Enviar el código al servidor
        const response = await axios.get(`http://127.0.0.1:8000/exchange-token?code=${code}`);
        const { access_token, refresh_token } = response.data;

        if (access_token) {
          localStorage.setItem('access_token', access_token);
        }

        if (refresh_token) {
          localStorage.setItem('refresh_token', refresh_token);
        }

        alert('Autenticación completada con éxito.');
      } catch (error) {
        console.error('Error al obtener los tokens:', error);
      }
    }
  };

  // Función para verificar el token y refrescarlo si es necesario
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const response = await axios.post('http://127.0.0.1:8000/refresh-token', { refresh_token: refreshToken });

        if (response.data.success && response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
          setAccessToken(response.data.access_token);
        } else {
          alert('No se pudo renovar el token de acceso.');
        }
      } catch (error) {
        console.error('Error al refrescar el token:', error);
        alert('Error al refrescar el token.');
      }
    } else {
      alert('No se ha encontrado un refresh_token. Por favor, autentica primero.');
    }
  };

  // UseEffect para cargar el token desde el almacenamiento local
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      setUploadStatus('Token encontrado en almacenamiento local.');
    } else {
      extractTokenFromUrl(); // Intentar extraer el token desde la URL
    }
  }, []);

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

  // Función para mostrar mensaje de error con Toast
  const showMessage = (severity, message) => {
    toastCenter.current.show({
      severity: severity,
      summary: message,
      detail: message,
      life: 3000,
    });
  };

  // Función para subir el archivo
  const handleFileUpload = async () => {
    if (!file) {
      showMessage('error', 'Selecciona un archivo primero.');
      return;
    }

    let token = accessToken || localStorage.getItem('access_token');
    if (!token) {
      await refreshAccessToken();  // Intentar refrescar el token
      token = localStorage.getItem('access_token');  // Recuperar el nuevo access token
      if (!token) {
        alert('No se pudo obtener un token válido.');
        return;
      }
    }

    setUploadStatus('Subiendo archivo...');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/upload-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUploadStatus(`Archivo subido con éxito: ${response.data.name}`);
      } else {
        setUploadStatus(`Error al subir el archivo: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setUploadStatus('Error al subir el archivo.');
    }
  };

  return (
    <div className="my-5 mx-auto max-w-4xl bg-white overflow-hidden shadow-lg sm:rounded-lg p-8">
      <div className='text-center mb-5'>
        <h2 className='text-2xl font-semibold text-gray-800'>Subir archivo a Google Drive</h2>
      </div>
      <div className='flex flex-col items-center border-2 border-gray-300 rounded-lg p-10'>
        {!accessToken && (
          <button
            className='px-6 py-3 mb-5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none'
            onClick={handleAuthClick}
          >
            Autenticar con Google
          </button>
        )}
        {accessToken && (
          <>
            <input
              type="file"
              className='hidden border-2 border-gray-300 rounded-lg p-3 mb-5 w-[500px] cursor-pointer hover:border-blue-500'
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <button
              onClick={() => document.querySelector('input[type="file"]').click()}
              className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none mb-3'
            >
              Seleccionar archivo
            </button>
            {fileName && (
              <div className="flex flex-row mb-5 mt-2 text-lg text-gray-700">
                <p className='mt-2'>Archivo seleccionado: <span>{fileName}</span></p>
                <button
                  onClick={handleRemoveFile}
                  className='ml-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none'
                >
                  X
                </button>
              </div>
            )}
            <button
              className='px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none'
              onClick={handleFileUpload}
            >
              Subir archivo
            </button>
          </>
        )}
        <Toast ref={toastCenter} position="center" />
        <div className="flex items-center justify-center w-full mt-4 text-xl">
          <Alert
            description={<span className="text-lg">{uploadStatus}</span>}
            title={<span className="text-xl">{'Estado Actual'}</span>}
          />
        </div>
      </div>
    </div>
  );
};

export default GoogleDriveUpload;
