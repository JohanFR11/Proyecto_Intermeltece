import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CategoryComponent from "./Components/CategoryComponent";
import PartNumComponent from "./Components/PartNumComponent";
import axios from "axios";


export default function Index({auth, unreadNotifications, data})
{
    const [partNums, setPartNums] = useState([]);

    const handleCategorySelect = async (selectedCategory) => {
      try {
        const response = await axios.get(route("zebra.filter.partnum", { categorySelected: selectedCategory }));
        setPartNums(response.data.partNums);
      } catch (error) {
        console.error("Error al obtener números de parte:", error);
      }
    };
    return (
        <AuthenticatedLayout
        auth={auth}
        unreadNotifications={unreadNotifications}
        header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Tabla de cotizacion de productos zebra</h2>
        }
        >


        <CategoryComponent data={data} onCategorySelect={handleCategorySelect} />

        <PartNumComponent partNums={partNums}/>

        </AuthenticatedLayout>
    );
}