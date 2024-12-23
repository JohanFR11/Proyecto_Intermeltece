import React from 'react';
import GoogleDriveUpload from './GoogleDriveUpload';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Index = ({auth, unreadNotifications}) => {
  return (
    <AuthenticatedLayout
    auth={auth}
    unreadNotifications={unreadNotifications}
    header={
      <h2 className="font-semibold text-xl text-gray-800 leading-tight">Subir Archivos de Auditorias</h2>
    }>
      <GoogleDriveUpload/>
    </AuthenticatedLayout>
  );
};

export default Index;