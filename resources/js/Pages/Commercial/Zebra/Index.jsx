import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CategoryComponent from "./Components/CategoryComponent";
import PartNumComponent from "./Components/PartNumComponent";
import axios from "axios";

export default function Index({ auth, unreadNotifications, data }) {
    const [PartNums, setPartNums] = useState([]);
    const [selectedParts, setSelectedParts] = useState([]); // Para almacenar los números de parte seleccionados
    const [listPrice, setListPrice] = useState('');

    const handleCategorySelect = async (selectedCategory) => {
        try {
            const response = await axios.get(
                route("zebra.filter.partnum", { categorySelected: selectedCategory })
                
            );
            setPartNums(response.data.partNums);
            setSelectedParts([]);
            setListPrice(''); 
            
        } catch (error) {
            console.error("Error al obtener números de parte:", error);
        }
    };

    const handlePartNumSelect = async (selectedPart) => {
        // Actualizar el estado de los números de parte seleccionados
        const updatedSelectedParts = selectedParts.includes(selectedPart)
            ? selectedParts.filter((part) => part !== selectedPart) // Eliminar si ya está seleccionado
            : [...selectedParts, selectedPart]; // Agregar si no está seleccionado

        setSelectedParts(updatedSelectedParts);

        // Enviar los números de parte seleccionados al backend
        try {
            const response = await axios.post(
                route("zebra.listprice"),
                { selectedParts: updatedSelectedParts }
            );
            setListPrice(response.data.totalListPrice); // Actualizar el precio total
        } catch (error) {
            console.error("Error al obtener el precio de lista:", error);
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            unreadNotifications={unreadNotifications}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tabla de cotizacion de productos zebra
                </h2>
            }
        >
            <CategoryComponent data={data} onCategorySelect={handleCategorySelect} />

            <PartNumComponent 
                partNums={PartNums} 
                selectedParts={selectedParts} 
                onPartNumSelect={handlePartNumSelect} 
                listPrice={listPrice} 
            />
        </AuthenticatedLayout>
    );
}
