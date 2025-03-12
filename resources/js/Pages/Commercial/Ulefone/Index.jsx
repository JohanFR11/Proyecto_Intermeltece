import React, { useState, useEffect } from "react";
import PreciosUlefone from "./PreciosUlefone";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

const Index = ({auth, unreadNotifications, data, odata}) => {

    return (
        <AuthenticatedLayout
        auth={auth}
        unreadNotifications={unreadNotifications}
        header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Tabla de Precios Ulefone</h2>
        }
        >
             <div>
                <PreciosUlefone data={data} odata={odata}/>
            </div>

        </AuthenticatedLayout>
  );
};

export default Index;