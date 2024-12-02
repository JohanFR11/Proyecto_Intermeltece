import React, {useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CategoryComponent from "./Components/CategoryComponent";
import NumeroComponente from "./Components/NumberComponent";
import axios from "axios";

export default function Index({auth, unreadNotifications, data, datosporsi})
{

    const [numberfilter, setPartNums] = useState([]);
    const [listPrice, setListPrice] = useState('');
    const [selectedParts, setSelectedParts] = useState([]);
   /*  const [todosPartNum, setTodosPartNum] = useState([]); */



    console.log('esa vaiana', numberfilter)
    console.log('datos xd ', datosporsi)

    const handleCategorySelect = async (selectedCategory) => {
      try {
          // Si no se selecciona ninguna categoría, pasar un valor vacío o null
          const response = await axios.get(route("zebra.filter.partnum", { categorySelected: selectedCategory || "" }));
          setPartNums(response.data.numberfilter); // Establecer todos los números de parte
          setSelectedParts([]); // Limpiar partes seleccionadas
          setListPrice(""); // Limpiar precio
      } catch (error) {
          console.error("Error al obtener números de parte:", error);
      }
  };

    const handlePartNumSelect = async (selectedPart) => {
        const updatedSelectedParts = selectedParts.includes(selectedPart)
            ? selectedParts.filter((part) => part !== selectedPart) // Eliminar si ya está seleccionado
            : [...selectedParts, selectedPart]; // Agregar si no está seleccionado
    
        setSelectedParts(updatedSelectedParts);

        if (updatedSelectedParts.length === 0) {
          setListPrice(0);
      }
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

    /* const todosimprecion = async () => {
      try {
        // Solicitar los datos de todos los números de parte
        const response = await axios.get(route("zebra.todospart"));
        // Asignar los datos obtenidos a todosPartNum
        setTodosPartNum(response.data.todosPartNum); // Almacenar en el estado todosPartNum
      } catch (error) {
        console.error("Error al obtener números de parte:", error);
      }
    }; */
    

    return (
        <AuthenticatedLayout
        auth={auth}
        unreadNotifications={unreadNotifications}
        header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">Tabla de cotizacion de productos zebra</h2>
        }
        >

        <CategoryComponent data={data} onCategorySelect={handleCategorySelect}/>    
        <NumeroComponente number={numberfilter} datosporsi={datosporsi} selectedParts={selectedParts} 
                onPartNumSelect={handlePartNumSelect} 
                listPrice={listPrice} />
        </AuthenticatedLayout>
    );
}