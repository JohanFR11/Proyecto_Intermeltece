import React from "react";
const AuthenticatedLayout = React.lazy(() => import('@/Layouts/AuthenticatedLayout'));

const Index = ({ auth, unreadNotifications }) => {
    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Logistica</h2>
            }
        >
            <div className="mt-5 bg-white overflow-hidden shadow-lg sm:rounded-lg p-4"> 
                <iframe
                    title="Informe__Seguimiento"
                    className="h-[500px] w-full"
                    src="https://app.powerbi.com/view?r=eyJrIjoiZmYyYjEwZDMtYTk0OC00NjNiLTg0MTAtODU1M2E4MmZlYzRkIiwidCI6ImQzOTZjNGY4LTMyOTgtNDg5ZS04YmQ0LTFkZjZiMmE0NzE4NCJ9" frameborder="0" allowFullScreen="true"></iframe>
            </div>
        </AuthenticatedLayout>
    )
}

export default Index;