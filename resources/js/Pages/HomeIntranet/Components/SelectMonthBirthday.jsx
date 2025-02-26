import React from "react";
import { User } from "@heroui/react";

export default function BirthDayUSers({ cumplePorMes, monthSelect }) {
    // Obtener el mes seleccionado del Set
    const mes = Array.from(monthSelect)[0] || null;

    console.log(mes)

    // Validar si el mes existe en los datos
    if (!mes || !cumplePorMes[mes]) {
        return <p className="text-center text-gray-500">Esperado seleccion de mes...</p>;
    }

    // Ordenar los usuarios por fecha de cumpleaños
    const ordenados = [...cumplePorMes[mes]].sort((a, b) => {
        const fechaA = new Date(a.fecha_cumpleaños).getDate();
        const fechaB = new Date(b.fecha_cumpleaños).getDate();
        return fechaA - fechaB;
    });

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {ordenados.map((user, index) => (
                <div key={user.identificacion || index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 text-center flex flex-col items-center justify-center transform hover:scale-105 transition-transform duration-300">
                    <User
                        avatarProps={{
                            src: "https://cdn-icons-png.flaticon.com/512/9755/9755144.png",
                            className: "rounded-full object-cover border-4 border-[#395181] shadow-md",
                        }}
                        description={[
                            <p className="text-gray-700 text-lg font-semibold mt-2">{user.cargo}</p>,
                            <p className="text-gray-500 text-sm">
                                📅 {new Date(user.fecha_cumpleaños + "T00:00:00").toLocaleDateString('es-CO', { month: "long", day: 'numeric' })}
                            </p>,
                        ]}
                        name={user.empleado}
                        className="text-xl font-bold text-[#395181]"
                    />
                </div>
            ))}
        </div>
    );
}
