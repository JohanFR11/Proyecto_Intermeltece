import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Contenido from "./Fragments/Contenido";
import AprendizajeLayout from "./Layout/AprendizajeLayout";

const Index = ({ auth, unreadNotifications }) => {

    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Modulo de aprendizaje</h2>
            }
        >
        <AprendizajeLayout>
                <Contenido />
        </AprendizajeLayout>

        </AuthenticatedLayout>
    );
};

export default Index;
