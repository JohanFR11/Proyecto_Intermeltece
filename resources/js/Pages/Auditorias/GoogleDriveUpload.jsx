import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GoogleDriveUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('Esperando archivo...');
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [listedFiles, setListedFiles] = useState([]);

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
  console.log("este es el code que devuelve " , code)

  if (code) {
    try {
      // Enviar el código al servidor
      const response = await axios.get(`http://127.0.0.1:8000/exchange-token?code=${code}`);
      const { access_token, refresh_token } = response.data;
      console.log(response.data)

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
        const response = await axios.post('http://127.0.0.1:8000/refresh-token', {
          refresh_token: refreshToken
        });
        
        if (response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
          setAccessToken(response.data.access_token);
        } else {
          alert('No se pudo renovar el token de acceso.');
          console.log("datos recibidos al intentar renovar el token: ", response.data)
        }
      } catch (error) {
        console.error('Error al refrescar el token:', error);
        alert('Error al refrescar el token.');
      }
    } else {
      alert('No se ha encontrado un refresh_token. Por favor, autentica primero. O comunicate con los desarrolladores para poder obtener permisos');
    }
  };

  // UseEffect para cargar el token desde el almacenamiento local
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    const storenRefreshToken = localStorage.getItem('refresh_token')
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
      setUploadStatus('Token encontrado en almacenamiento local.');
      console.log('este es el refresh token almacenado',storenRefreshToken)
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

// const listFiles = async () => {

//   let token = accessToken || localStorage.getItem('access_token');

//     const response= await axios.post('http://127.0.0.1:8000/list-files', {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     console.log(response.data)
//     if (!response.data.files){
//       setListedFiles([])
//     }
//     setListedFiles(response.data.files)
//   }
// listFiles()

  return (
    <div>
      <h2>Subir archivo a Google Drive</h2>
      <button onClick={handleAuthClick}>Autenticar con Google</button>
      {!accessToken && 
      <button onClick={handleAuthClick}>Autenticar con Google</button>
      }
      {accessToken && <>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Subir archivo</button>
    </> }
      <p>{uploadStatus}</p>

      {accessToken && <>
        {listedFiles.length > 0 ? (
                    listedFiles.map((row, index) => (
                      <tr 
                        key={index}
                      >
                        <td className="p-3 border-b border-blue-700 text-sm">
                          {row.files}
                        </td>                
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="py-4 px-6 text-center text-sm">
                        no se han encontrado datos/ no se han subido archivos todavia.
                      </td>
                    </tr>
                  )}
    </> }
    </div>
  );
};

export default GoogleDriveUpload;
