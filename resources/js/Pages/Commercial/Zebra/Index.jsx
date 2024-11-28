import React, {useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CategoryComponent from "./Components/CategoryComponent";
import NumeroComponente from "./Components/NumberComponent";
import axios from "axios";

export default function Index({auth, unreadNotifications, data, number })
{

    const [numberfilter, setPartNums] = useState([]);

    console.log('esa vaiana', numberfilter)

    const handleCategorySelect = async (selectedCategory) => {
        const encodedCategory = encodeURIComponent(selectedCategory);  // Codificar la categoría
        try {
            const response = await axios.get(route("zebra.filter.partnum", { categorySelected: encodedCategory }));
            console.log("Part Numbers filtrados:", response.data); // Asegúrate de que la respuesta contenga los datos esperados
            setPartNums(response.data.numberfilter);
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

        <CategoryComponent data={data} onCategorySelect={handleCategorySelect}/>    
        <NumeroComponente number={numberfilter}/>
        </AuthenticatedLayout>
    );
}