import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ObtenerCursos from "../Components/ObtenerCursos";
import ObtenerContenido from "../Components/ObtenerContenido";

export default function Capacitaciones({ auth, unreadNotifications }) {
    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Modulo de Capacitaciones</h2>
            }
        >
        <Router>
            <Routes>
                <Route path="/" element={<ObtenerCursos />} />
                <Route path="/contenido" element={<ObtenerContenido />} />
            </Routes>
        </Router>
        </AuthenticatedLayout>
    )
}