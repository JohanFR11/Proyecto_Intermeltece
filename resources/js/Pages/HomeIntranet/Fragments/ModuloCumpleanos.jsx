import React from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

const Cumpleanos = ({ auth, unreadNotifications}) => {
    return (
        <AuthenticatedLayout
              auth={auth}
              unreadNotifications={unreadNotifications}
              header={
                <h2 className='font-semibold text-xl text-gray-800 leading-tight'>
                  Inicio Meltec Comunicaciones S.A
                </h2>
              }
            >
            <div>
                <p>Proximamente</p>
            </div>
        </AuthenticatedLayout>
    )
}

export default Cumpleanos;