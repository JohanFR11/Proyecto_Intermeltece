import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Capacitaciones({ auth, unreadNotifications }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Modulo de Capacitaciones</h2>
            }
        >
            <div className="bg-white mt-4 mb-4 ml-4 mr-4 p-3">
                
            </div>
        </AuthenticatedLayout>
    )
}