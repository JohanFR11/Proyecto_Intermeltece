import React, {useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CategoryComponent from "./Components/CategoryComponent";
import NumeroComponente from "./Components/NumberComponent";
import axios from "axios";

export default function Index({auth, unreadNotifications, data})
{

    const [numberfilter, setPartNums] = useState([]);
    const [listPrice, setListPrice] = useState('');
    const [selectedParts, setSelectedParts] = useState([]);


    console.log('esa vaiana', numberfilter)

    const handleCategorySelect = async (selectedCategory) => {
  try {
    // Si se selecciona la opción "-- Selecciona una categoría --", mostramos todos los números de parte
    if (selectedCategory === "") {
      setPartNums(data.numberfilter); // Establecer todos los números de parte en el estado
      setSelectedParts([]); // Limpiar partes seleccionadas
      setListPrice(""); // Limpiar precio
    } else {
      // Si se selecciona una categoría específica, filtramos los números de parte
      const response = await axios.get(
        route("zebra.filter.partnum", { categorySelected:  selectedCategory })
      );
      setPartNums(response.data.numberfilter); // Establecer los números de parte filtrados
      setSelectedParts([]); // Limpiar partes seleccionadas
      setListPrice(""); // Limpiar precio
    }
  } catch (error) {
    console.error("Error al obtener números de parte:", error);
  }
};


    const handlePartNumSelect = async (selectedPart) => {
        const updatedSelectedParts = selectedParts.includes(selectedPart)
            ? selectedParts.filter((part) => part !== selectedPart) // Eliminar si ya está seleccionado
            : [...selectedParts, selectedPart]; // Agregar si no está seleccionado
    
        setSelectedParts(updatedSelectedParts);
    
        // Solo enviar la solicitud si hay partes seleccionadas
        if (updatedSelectedParts.length > 0) {
            try {
                const response = await axios.post(
                    route("zebra.listprice"),
                    { selectedParts: updatedSelectedParts }
                );
                setListPrice(response.data.totalPrice); // Actualizar el precio total
            } catch (error) {
                console.error("Error al obtener el precio de lista:", error);
            }
        } else {
            setListPrice(''); // Limpiar el precio si no hay partes seleccionadas
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
        <NumeroComponente number={numberfilter} selectedParts={selectedParts} 
                onPartNumSelect={handlePartNumSelect} 
                listPrice={listPrice} />
        </AuthenticatedLayout>
    );
}