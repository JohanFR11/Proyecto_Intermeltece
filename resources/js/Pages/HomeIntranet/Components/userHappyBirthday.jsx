import React, { useState, useEffect } from "react";
import { User, Select, SelectSection, SelectItem } from "@heroui/react";
import axios from "axios";
const BirthDayUSers = React.lazy(() => import('../Components/SelectMonthBirthday'));

export default function UserHappyBirthday() {

    const [userHappy, setUserHappy] = useState([]);
    const [monthSelect, setMonthSelect] = useState([]);

    const usersHappy = async () => {
        try {
            const response = await axios.get("/cumpleanos/happybirthday");

            if (!response.data.users) {
                setUserHappy([])
            } else {
                setUserHappy(response.data.users);
            }
        } catch (error) {
            console.error("Error en la peticion HappyBirthday:", error);
        }
    }

    useEffect(() => {
        usersHappy();
    }, []);

    const agruparPorMes = (personas) => {
        return personas.reduce((acc, persona) => {
            const mes = new Date(persona.fecha_cumpleaños).getMonth() + 1;
            if (!acc[mes]) acc[mes] = [];
            acc[mes].push(persona);
            return acc;
        }, {});
    };

    const cumplePorMes = agruparPorMes(userHappy);



    return (
        <div className="p-3 m-5">
            {userHappy.length > 0 ? (
                <div className="text-center">
                    <Select
                        className="max-w-xs text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-lg shadow-md"
                        label="🎉 Selecciona el mes"
                        selectedKeys={monthSelect}
                        onSelectionChange={(keys) => setMonthSelect(keys)}
                    >
                        {Object.keys(cumplePorMes).map(mes => (
                            <SelectItem key={mes} className="capitalize text-gray-800 font-medium hover:bg-purple-200">
                                {new Date(mes).toLocaleDateString('es-CO', { month: "long" })}
                            </SelectItem>
                        ))}
                    </Select>
                    {monthSelect && <BirthDayUSers cumplePorMes={cumplePorMes} monthSelect={monthSelect} />}
                </div>
            ) : (
                <Select className="max-w-xs" label="cargando...">
                    <SelectItem>cargando...</SelectItem>
                </Select>
            )}

        </div>
    )
}