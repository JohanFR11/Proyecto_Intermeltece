import React, { useState } from "react";
import { useDisclosure, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react'
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CategoryComponent from "./Components/CategoryComponent";
import PartNumComponent from "./Components/PartNumComponent";
import ModalZebra from "./Fragments/ModalZebra";
import axios from "axios";

export default function Index({ auth, unreadNotifications, data, partNumData }) {
    const [PartNums, setPartNums] = useState([]);
    const [selectedParts, setSelectedParts] = useState([]); // Para almacenar los números de parte seleccionados
    const [listPrice, setListPrice] = useState('');
    const [finalPrice, setFinalPrice] = useState('');
    const [percentage, setPercentage] = useState('');
    const [imagen, setImagen] = useState([]);
    const [desc, setDesc] = useState('');
    const [partDetails, setPartDetails] = useState([]);
    const [quantities, setQuantities] = useState({}); // Estado para almacenar cantidades

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [size, setSize] = React.useState('md')

    const sizes = ["5xl"];


    const handleOpen = (size) => {
        setSize(size)
        onOpen();
    }

    // Manejar cambios en la cantidad
    const handleQuantityChange = (partNumber, newQuantity) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [partNumber]: newQuantity, // Actualiza la cantidad para el número de parte
        }));
    };

    const handleCategorySelect = async (selectedCategory) => {
        try {
            // Si no se selecciona ninguna categoría, pasar un valor vacío o null
            const response = await axios.get(route("zebra.filter.partnum", { categorySelected: selectedCategory || "" }));
            setPartNums(response.data.partNums); // Establecer todos los números de parte
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
            setDesc(0);
        }
        // Enviar los números de parte seleccionados al backend
        fetchDataForSelectedParts(updatedSelectedParts);
        // Enviar los números de parte seleccionados al backend
    };


    const fetchDataForSelectedParts = async (updatedSelectedParts) => {
        try {
            // Realizar las solicitudes al backend de forma eficiente
            const [listPriceResponse, finalPriceResponse, DescPartResponse, datosPartesResponse] = await Promise.all([
                axios.post(route("zebra.listprice"), { selectedParts: updatedSelectedParts }),
                axios.post(route("zebra.finalprice"), { selectedParts: updatedSelectedParts }),
                axios.post(route("zebra.desc"), { selectedParts: updatedSelectedParts }),
                axios.post(route("zebra.datospartes"), { selectedParts: updatedSelectedParts }),
            ]);

            // Actualizar los estados con los datos obtenidos
            setListPrice(listPriceResponse.data.totalListPrice);
            setFinalPrice(finalPriceResponse.data.totalFinalPrice);
            setPercentage(finalPriceResponse.data.descuento);
            setImagen(DescPartResponse.data.imagen);
            setDesc(DescPartResponse.data.Desc)

            const mappedParts = updatedSelectedParts.map((part) => {
                const listPrice = datosPartesResponse.data.listPrice[part] || 0;
                const finalPrice = datosPartesResponse.data.totalPrice[part] || 0;
                const descuento = datosPartesResponse.data.descuento[part] || 0;
                const info = datosPartesResponse.data.dataInfo[part]?.[0] || {};
                //console.log(info)

                return {
                    partNumber: part,
                    listPrice: listPrice,
                    finalPrice: finalPrice,
                    descuento: descuento,
                    dataInfo: info,
                };
            });

            // Actualizar el estado con la información consolidada
            setPartDetails(mappedParts);

        } catch (error) {
            console.error("Error al obtener precios:", error);
        }
    };
    console.log(partDetails)
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
            <div className="flex flex-col md:flex-row items-start gap-6 p-4">
                {/* Panel izquierdo: Categorías y números de parte */}
                <div className="w-full md:w-1/3 bg-white border border-gray-300 rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Selección de Productos
                    </h3>
                    <CategoryComponent data={data} onCategorySelect={handleCategorySelect} />
                    <PartNumComponent
                        partNums={PartNums}
                        allData={partNumData}
                        selectedParts={selectedParts}
                        onPartNumSelect={handlePartNumSelect}
                    />
                </div>

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

                    <div className="w-full bg-white border border-gray-300 rounded-lg shadow mt-6 p-4 flex items-center gap-4">
                        <div className="w-1/2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Imagen</h3>
                            {imagen.length > 0 ? (
                                <img
                                    src={imagen} // Mostrar solo la última imagen
                                    className="w-full h-32 object-contain border rounded"
                                />
                            ) : (
                                <p className="text-gray-600">No hay imágenes disponibles para el número de parte seleccionado.</p>
                            )}
                        </div>
                        <div className="w-1/2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Descripción</h3>
                            {desc.length > 0 ? (
                                <p className="text-gray-700">{desc}</p> // Mostrar la última descripción
                            ) : (
                                <p className="text-gray-600">No hay descripción disponible para el número de parte seleccionado.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-6 p-4">
                <div className="overflow-x-auto w-full"> {/* Se agrega un contenedor para el scroll horizontal */}
                    <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-blue-300 text-white text-sm font-semibold uppercase">
                                <th className="py-3 px-6 text-left text-gray-700">N° Parte</th>
                                <th className="py-3 px-6 text-left text-gray-700">Tipo Producto</th>
                                <th className="py-3 px-6 text-left text-gray-700">Moneda</th>
                                <th className="py-3 px-6 text-left text-gray-700">Cantidad</th>
                                <th className="py-3 px-6 text-left text-gray-700">Precio Lista</th>
                                <th className="py-3 px-6 text-left text-gray-700">Precio Final</th>
                                <th className="py-3 px-6 text-left text-gray-700">Descuento</th>
                                <th className="py-3 px-6 text-left text-gray-700">Categoria Producto</th>
                                <th className="py-3 px-6 text-left text-gray-700">Descripción</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-800">
                            {partDetails.length > 0 ? (
                                partDetails.map((partDetail, index) => {
                                    const quantity = quantities[partDetail.partNumber] || 1;
                                    const listPrice = parseFloat(partDetail.listPrice.replace(/,/g, ""));
                                    const finalPrice = parseFloat(partDetail.finalPrice.replace(/,/g, ""));
                                    const totalListPrice =( listPrice* quantity).toFixed(2);
                                    const totalFinalPrice = (finalPrice * quantity).toFixed(2);
                                    
                                    return(
                                    <tr className="border-b hover:bg-gray-100" key={index}>
                                        <td className="py-3 px-6">{partDetail.partNumber}</td>
                                        <td className="py-3 px-6">{partDetail.dataInfo.Product_Type}</td>
                                        <td className="py-3 px-6">{partDetail.dataInfo.Currency}</td>
                                        <td className="py-3 px-6">
                                            <input
                                                type="number"
                                                min="1"
                                                className="w-20 border border-gray-300 rounded px-2 py-1"
                                                value={quantity}
                                                onChange={(e) =>
                                                    handleQuantityChange(partDetail.partNumber, parseInt(e.target.value) || 0)
                                                }
                                            />
                                        </td>
                                        <td className="py-3 px-6">{ totalListPrice}</td>
                                        <td className="py-3 px-6">{ totalFinalPrice}</td>
                                        <td className="py-3 px-6">{`${partDetail.descuento}%`}</td>
                                        <td className="py-3 px-6">{partDetail.dataInfo.Product_Category}</td>
                                        <td className="py-3 px-6">{partDetail.dataInfo.Short_Marketing_Desc}</td>
                                    </tr>
                                )})
                            ) : (
                                <tr>
                                    <td colSpan="8" className="py-3 px-6 text-center">No se han seleccionado productos aún.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Botón para abrir el modal */}
            {sizes.map((size) => (
                <Button key={size} onPress={() => handleOpen(size)} color="primary">Factura</Button>
            ))}

            {/* Aquí se integra el ModalZebra con useDisclosure */}
            <ModalZebra size={size} open={isOpen} close={onClose} partDetails={partDetails} quantities={quantities}/>
        </AuthenticatedLayout>
    );

}