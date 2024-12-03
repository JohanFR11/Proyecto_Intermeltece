import React, {useState} from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CategoryComponent from "./Components/CategoryComponent";
import NumeroComponente from "./Components/NumberComponent";
import axios from "axios";

export default function Index({auth, unreadNotifications, data, datosporsi})
{

    const [numberfilter, setPartNums] = useState([]);
    const [selectedParts, setSelectedParts] = useState([]);
    const [listPrice, setListPrice] = useState('');
    const [finalPrice, setFinalPrice]= useState('');
    const [percentage, setPercentage]= useState('');
    const [imagen, setImagen] = useState([]);

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
    // Actualizar el estado de los números de parte seleccionados
    const updatedSelectedParts = selectedParts.includes(selectedPart)
        ? selectedParts.filter((part) => part !== selectedPart) // Eliminar si ya está seleccionado
        : [...selectedParts, selectedPart]; // Agregar si no está seleccionado

    setSelectedParts(updatedSelectedParts);

    if (updatedSelectedParts.length === 0) {
        setListPrice(0);
        setFinalPrice(0);
        setPercentage(0);
        setImagen(0);
    }

    // Enviar los números de parte seleccionados al backend
    try {
        // Realizar ambas solicitudes al backend en paralelo
        const [listPriceResponse, finalPriceResponse, imagenPartResponse] = await Promise.all([
            axios.post(route("zebra.listprice"), { selectedParts: updatedSelectedParts }),
            axios.post(route("zebra.finalprice"), { selectedParts: updatedSelectedParts }),
            axios.post(route("zebra.imagenpart"), { selectedParts: updatedSelectedParts }),
        ]);

        // Actualizar el precio total y el precio final
        setListPrice(listPriceResponse.data.totalPrice);
        setFinalPrice(finalPriceResponse.data.totalPrice);
        setPercentage(finalPriceResponse.data.descuento);
        setImagen(imagenPartResponse.data.imagenpart);
    } catch (error) {
        console.error("Error al obtener precios:", error);
    }
};

return (
    <AuthenticatedLayout
        auth={auth}
        unreadNotifications={unreadNotifications}
        header={
            <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                Tabla de cotización de productos Zebra
            </h2>
        }
    >
        <div className="flex flex-col md:flex-row items-start gap-6 p-4">
            {/* Panel izquierdo: Categorías y números de parte */}
            <div className="w-full md:w-1/3 bg-white border border-gray-300 rounded-lg shadow p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Selección de Productos
                </h3>
                <CategoryComponent data={data} onCategorySelect={handleCategorySelect} />
                <NumeroComponente
                    number={numberfilter}
                    datosporsi={datosporsi}
                    selectedParts={selectedParts}
                    onPartNumSelect={handlePartNumSelect}
                    listPrice={listPrice}
                    finalPrice={finalPrice}
                    porcentaje={percentage}
                />
            </div>

            {/* Panel derecho: Resumen */}
            <div className="flex flex-col w-full bg-white border border-gray-300 rounded-lg shadow-lg p-5">
                {/* Resumen en 3 columnas */}
                <div className="flex justify-between p-5 border border-gray-300 rounded-full">
                    {/* Columna: Precio Lista */}
                    <div className="text-center">
                        <p className="text-sm font-bold text-gray-600">Precio Lista</p>
                        <p className="text-lg font-semibold text-gray-800">
                            {listPrice ? `${listPrice} USD` : "0 USD"}
                        </p>
                    </div>

                    {/* Columna: Precio Final */}
                    <div className="text-center">
                        <p className="text-sm font-bold text-gray-600">Precio Final</p>
                        <p className="text-lg font-semibold text-gray-800">
                            {finalPrice ? `${finalPrice} USD` : "0 USD"}
                        </p>
                    </div>

                    {/* Columna: Descuento */}
                    <div className="text-center">
                        <p className="text-sm font-bold text-gray-600">Descuento</p>
                        <p className="text-lg font-semibold text-green-600">
                            {percentage ? `${percentage}%` : "0%"}
                        </p>
                    </div>
                </div>

                {/* Sección de imágenes: Mostrar solo la primera imagen */}
                <div className="w-full bg-white border border-gray-300 rounded-lg shadow mt-6 p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Imagen</h3>
                    {imagen.length > 0 ? (
                        <img
                            src={imagen[imagen.length -1]} // Mostrar solo la primera imagen
                            alt={`Imagen del Part Number ${selectedParts[selectedParts.length - 1]}`} // Relacionada con el primer número de parte
                            className="w-full h-32 object-contain border rounded"
                        />
                    ) : (
                        <p className="text-gray-600">
                            No hay imágenes disponibles para el número de parte seleccionado.
                        </p>
                    )}
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
);

}