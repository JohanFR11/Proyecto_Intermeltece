import React, { useState, useEffect } from 'react';
import axios from 'axios';


const GoogleDriveUpload = ({refreshAccessToken}) => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('Esperando archivo...');
  const [accessToken, setAccessToken] = useState(null);


  // Función para redirigir al usuario para autenticarse
  const handleAuthClick = async () => {
    const clientId = 'clientid';
    const redirectUri = 'http://127.0.0.1:8000/auditoria';  // URL donde el usuario es redirigido después de autenticarse
    const scope = 'https://www.googleapis.com/auth/drive';


    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&access_type=offline&prompt=consent&scope=${scope}`;
    window.location.href = authUrl;

  };

  // Función para extraer el access_token de la URL
  const extractTokenFromUrl = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log("este es el code que devuelve ", code)

    if (code) {
      try {
        // Enviar el código al servidor
        const response = await axios.get(`http://127.0.0.1:8000/exchange-token?code=${code}`);
        const { access_token, refresh_token } = response.data;
        if (access_token) {
          localStorage.setItem('access_token', access_token);
          setAccessToken(access_token)
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
    }
  };

  // Función para subir el archivo
  const handleFileUpload = async () => {
    if (!file) {
      alert('Selecciona un archivo primero.');
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
          alert('No se pudo obtener un token válido.');
          return;
        }
      } catch (error) {
        alert('Error al renovar el token: ' + error.message);
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
          refresh_token: refreshToken
        }
      );

      if (response.data.success) {
        setUploadStatus(`Archivo subido con éxito: ${response.data.name}`);
      } else {
        setUploadStatus(`Error al subir el archivo: ${response.data.error}`);
        console.log(response.data)
      }
    } catch (error) {
      console.error('Error al subir el archivo:', error);
      setUploadStatus('Error al subir el archivo.');
    }
  };

  return (
    <div>
      <h2>Subir archivo a Google Drive</h2>
      {(!accessToken || accessToken === 'null') ? ( // Verificar si no hay token
        <button onClick={handleAuthClick}>Autenticar con Google</button>
      ) : (
        <>
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleFileUpload}>Subir archivo</button>
        </>
      )}
      <p>{uploadStatus}</p>
    </div>
  );  
};

export default GoogleDriveUpload;
