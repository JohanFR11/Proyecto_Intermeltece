import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { SnackbarProvider, useSnackbar } from 'notistack';

const GoogleDriveAuth = () => {
  const [accessToken, setAccessToken] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  // Función para redirigir al usuario para autenticarse
  const handleAuthClick = async () => {
    const clientId = '714516731386-9av4nplhrj4ssu4j79psumo7pur8unpl.apps.googleusercontent.com';
    const redirectUri = 'https://fleet-cub-able.ngrok-free.app/dashboard';  // URL donde el usuario es redirigido después de autenticarse
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
        const response = await axios.get(`https://fleet-cub-able.ngrok-free.app/auth/exchange-token?code=${code}`);
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
        const response = await axios.post('https://fleet-cub-able.ngrok-free.app/auth/refresh-token', {
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

  }, []);

  return (
    <SnackbarProvider maxSnack={3}>
      <div className="my-5 mx-auto max-w-4xl bg-white overflow-hidden shadow-lg sm:rounded-lg p-8">
        <div className='text-center mb-5'>
          <h2 className='text-2xl font-semibold text-gray-800'>Gracias por iniciar con Google, para terminar el registro termina con el ultimo paso.</h2>
        </div>
        <div className='flex flex-col items-center border-2 border-gray-300 rounded-lg p-10'>
            <button
              className='px-6 py-3 mb-5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none'
              onClick={handleAuthClick}
            >
              Autenticar
            </button>     
        </div>
      </div>
    </SnackbarProvider>
  );
};

export default GoogleDriveAuth;
