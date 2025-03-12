import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Alert, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";
import { SnackbarProvider, useSnackbar } from 'notistack';
import AuditoriasUsers from './Fragments/AuditoriasUsers';

const GoogleDriveUpload = () => {
  const [accessToken, setAccessToken] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const [listedFolders, setListedFolders] = useState([]);
  const [subFolders, setSubFolders] = useState(false);
  const [showFileUploadComponent, setShowFileUploadComponent] = useState(false); 
  const [subfolderId, setSubFolderId] = useState(null);


  // Función para redirigir al usuario para autenticarse
  const handleAuthClick = async () => {
    const clientId = '714516731386-9av4nplhrj4ssu4j79psumo7pur8unpl.apps.googleusercontent.com';
    const redirectUri = 'https://internal.meltec.com.co/auditoria';  // URL donde el usuario es redirigido después de autenticarse
    const scope = 'https://www.googleapis.com/auth/drive.file';

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
        const response = await axios.get(`https://internal.meltec.com.co/exchange-token?code=${code}`);
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

  const tokenNorenovar = () => {
    enqueueSnackbar('No se pudo renovar el token de acceso.', {
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
  const tokenError = () => {
    enqueueSnackbar('Error al refrescar el token.', {
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
  const Recomendacion = () => {
    enqueueSnackbar('No se ha encontrado un refresh_token. Por favor, autentica primero. O comunicate con los desarrolladores para poder obtener permisos.', {
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

  // Función para verificar el token y refrescarlo si es necesario
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const response = await axios.post('https://internal.meltec.com.co/refresh-token', {
          refresh_token: refreshToken
        });

        if (response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
          setAccessToken(response.data.access_token);
        } else {
          tokenNorenovar();
          console.log("datos recibidos al intentar renovar el token: ", response.data)
        }
      } catch (error) {
        console.error('Error al refrescar el token:', error);
        tokenError();
      }
    } else {
      Recomendacion();
    }
  };

  // UseEffect para cargar el token desde el almacenamiento local
  useEffect(() => {
    const storedAccessToken = localStorage.getItem('access_token');
    localStorage.setItem('refresh_token', '1//058OGBxklT9XOCgYIARAAGAUSNwF-L9IrM24Hx4DgYBbfETA5qRHZdB2nySgdcMjvTHtSR3iQbElR_i7n-_3oyfveUak9XbDLutk');
    console.log(localStorage.getItem('refresh_token'))
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    } else {
      extractTokenFromUrl(); // Intentar extraer el token desde la URL
    }

    listFolders();

  }, []);

  const listFolders = async () => {
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
      const response = await axios.post('https://internal.meltec.com.co/list-folders',
        {},
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.data.folders) {
        setListedFolders([]);
      } else {
        setListedFolders(response.data.folders);
      }
    } catch (error) {
      console.error('Error al listar archivos:', error);
    }
  }

  const enviarIdCarpeta = async (id_subfolder) => {
    console.log('Esta es la id del folder seleccionado', id_subfolder)
    const token = localStorage.getItem('access_token');

    // Si no tienes el token, intenta obtenerlo o manejar el caso de error
    if (!token) {
      console.error('Token de acceso no encontrado');
      enqueueSnackbar('Token de acceso no encontrado, por favor inicie sesión.', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'center' },
        autoHideDuration: 2000
      });
      return;
    }
    setSubFolders([]);
    try {
      const response = await axios.get(`/list-folders/subcarpetas/${id_subfolder}`,
        {
          headers: {
            'Authorization': `Bearer ${token}` // Enviar el token en la cabecera
          }
        });
      console.log('necesito', response.data.subfolders)
      setSubFolders(response.data.subfolders);
    } catch (error) {
      console.error("Error al cargar los datos del modelo", error.response ? error.response.data : error.message);
    }
  }

  const renderApartado = async (id_subfolder) =>{
      setSubFolderId(id_subfolder);
      setShowFileUploadComponent(true);
  }

  return (
    <SnackbarProvider maxSnack={3}>
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
              {/* Lista de carpetas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                {listedFolders.map((folder, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 shadow duration-300 hover:shadow-lg transition-shadow"
                  >
                    {/* Nombre del archivo */}
                    <Dropdown>
                      <DropdownTrigger>
                        <button onClick={() => enviarIdCarpeta(folder.id)} variant='bordered'>{folder.folder_name}</button>
                      </DropdownTrigger>
                      {subFolders ? (
                        <DropdownMenu aria-label="Static Actions">
                          {subFolders.length > 0 ? (
                            subFolders.map((subfolder, subIndex) => (
                              <DropdownItem key={subIndex} onPress={() => renderApartado(subfolder.sub_id)}>
                                {subfolder.subfolder_name}
                              </DropdownItem>
                            ))
                          ) : (
                            <DropdownItem >
                              No se encuentran carpetas disponibles 
                            </DropdownItem>
                          )}
                        </DropdownMenu>
                      ) : (
                        <p>Cargando carpetas ...</p>
                      )}                     
                    </Dropdown>
                  </div>
                ))}
              </div>
            </>
          )}
            {showFileUploadComponent && (
              <AuditoriasUsers refreshAccessToken={refreshAccessToken} subFolderId={subfolderId}/>
            )}        
        </div>
      </div>
    </SnackbarProvider>
  );
};

export default GoogleDriveUpload;