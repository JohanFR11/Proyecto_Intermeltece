import React from 'react';
import GoogleDriveUpload from './GoogleDriveUpload';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import DocumentList from './DocumentList';

const Index = ({auth, unreadNotifications}) => {
  const refreshAccessToken = async () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post('http://127.0.0.1:8000/refresh-token', {
            refresh_token: refreshToken
          });
  
          if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
      
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
  
  return (
    <AuthenticatedLayout
    auth={auth}
    unreadNotifications={unreadNotifications}
    header={
      <h2 className="font-semibold text-xl text-gray-800 leading-tight">Subir Archivos de Auditorias</h2>
    }>
      <GoogleDriveUpload refreshAccessToken={refreshAccessToken}/>

      <DocumentList onRefreshAccessToken={refreshAccessToken}/>
    </AuthenticatedLayout>
  );
};

export default Index;