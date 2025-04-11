import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Contenido from "./Fragments/Contenido";
import AprendizajeLayout from "./Layout/AprendizajeLayout";
import { usePage } from '@inertiajs/react';

const Index = ({ auth, unreadNotifications }) => {

    const {
        props: { userMoodle, token }
    } = usePage();

    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Modulo de aprendizaje</h2>
            }
        >
        <AprendizajeLayout
            userid={userMoodle.userid}
        >
                <Contenido token={token.token} userid={userMoodle.userid}/>
        </AprendizajeLayout>

        </AuthenticatedLayout>
    );
};

export default Index;
