import React, { useEffect, useState } from "react";
import { Card, CardBody, Button, Input } from "@heroui/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function LoginMoodle({ auth, unreadNotifications }) {

    const [error, setError] = useState("");
    const [formData, setFormData] = useState({

        username: "",
        password: "",
    });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("")

        const formData = new FormData(e.target);

        try {

            const response = await axios.post("/moodle/login", Object.fromEntries(formData), {
                withCredentials: true
            });

            const dataToken = response.data.token;
            const dataUser = response.data.userData;

            if (dataToken.token) {
                localStorage.setItem("moodle_token", dataToken.token);
                localStorage.setItem("user_id", dataUser.userid);
                localStorage.setItem("user_name", dataUser.fullname);
                window.location.href='/modulo/index';
            } else {
                setError("Credenciales incorrectas o servicio no disponible.");
            }


        } catch (err) {
            setError(err.response?.data?.error || "Error al iniciar sesión");
            console.log(err.response.data)
        }
    };

    const redirectTo = (ruta) => {
        window.location.href = ruta;
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Inicio de sesion del modulo de aprendizaje</h2>
            }
        >
            <div className="p-6 bg-white min-h-screen flex flex-col items-center justify-center">
                <Card className="w-full max-w-md bg-blue-100 border border-blue-300 rounded-lg shadow-md p-6">
                    <CardBody>
                        <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">Iniciar sesión en Moodle</h2>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="text-gray-700">Usuario:</label>
                                <Input type="text" name="username" onChange={handleChange} required className="w-full mt-1" />
                            </div>
                            <div>
                                <label className="text-gray-700">Contraseña:</label>
                                <Input type="password" name="password" onChange={handleChange} required className="w-full mt-1" />
                            </div>
                            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-purple-600 transition">Iniciar sesión</Button>
                        </form>
                        <button onClick={() => redirectTo('/modulo/register')} className="w-full mt-3 bg-gray-300 text-gray-700 hover:bg-gray-400 transition">
                            Registrarse
                        </button>
                        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                    </CardBody>
                </Card>
            </div>

        </AuthenticatedLayout>
    );
}
