import { useState, useEffect } from "react";
import { Tooltip } from "@nextui-org/react";
import { InfoIcon } from "lucide-react"; 
import axios from "axios";
import { Card, CardBody, Button, Input, Spinner } from "@heroui/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function RegisterMoodle({ auth, unreadNotifications }) {

    const [user, setUser] = useState(null);  // Almacena los datos del usuario
    const [arrayName, setArrayName] = useState(null);  
    const [loading, setLoading] = useState(true);  // Indicador de carga
    

    useEffect(() => {
        axios
            .get("/user", { withCredentials: true })  // Llamada a la API
            .then((res) => {
                setUser(res.data);  // Guarda la respuesta de la API en el estado
                if (res.data.name) {  // Verifica que name exista
                    setArrayName(res.data.name.split(" "));
                }
            })
            .catch(() => {
                setUser(null);  // Si hay error, no hay usuario
                setArrayName([]);
            })
            .finally(() => {
                setLoading(false);  // Marca como "no cargando" después de la solicitud
            });
    }, []);

    const [formData, setFormData] = useState({
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });

   

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const response = await axios.post("/moodle_ws/register", Object.fromEntries(formData));

            const dataToken = response.data.token;
            const dataUser = response.data.userData;

           if (dataToken.token) {
               localStorage.setItem("moodle_token", dataToken.token);
               localStorage.setItem("user_id", dataUser.userid);
               localStorage.setItem("user_name", dataUser.fullname);
               window.location.href='/modulo/index';
            } else {
                alert("ocurrio un error inesperado, intente de nuevo");
            }
        } catch (error) {
            alert("Error en el registro: " + error.response.data.error);
            console.log(error.response.data)
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Registro del modulo de aprendizaje</h2>
            }
        >

            <div className="p-6 bg-white min-h-screen flex flex-col items-center justify-center">
                <Card className="w-full max-w-md bg-blue-100 border border-blue-300 rounded-lg shadow-md p-6">
                    <CardBody>
                        <h2 className="text-2xl font-bold text-blue-700 text-center mb-4">Registro en Moodle</h2>
                        {loading ? (
                            <div className="flex justify-center">
                                <Spinner className="text-blue-600" />
                                <p className="ml-2 text-gray-700">Cargando...</p>
                            </div>
                        ) : user ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Input type="hidden" name="username" value={user.email} required />
                                </div>
                                <Input type="hidden" name="firstname" value={arrayName.slice(0, 2).join(" ")} />
                                <Input type="hidden" name="lastname" value={arrayName.slice(2).join(" ")} />
                                <div>
                                    <label className="text-gray-700">Correo Electrónico:</label>
                                    <Input type="email" name="email" value={user.email} readOnly className="w-full mt-1 bg-gray-200" />
                                </div>
                                <div>
                                    <label className="text-gray-700 gap-2">
                                        Contraseña:
                                        <Tooltip content="Debe contener al menos 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial">
                                            <InfoIcon className="w-4 h-4 text-blue-500 cursor-pointer" />
                                        </Tooltip>
                                    </label>
                                    <Input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required className="w-full mt-1" />
                                </div>
                                <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-purple-600 transition">Registrarse</Button>
                            </form>
                        ) : (
                            <p className="text-red-500 text-center mt-2">Ha ocurrido un error, intente de nuevo.</p>
                        )}
                    </CardBody>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
