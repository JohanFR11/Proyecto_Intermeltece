import React, { useState, useEffect } from "react";
import { useDisclosure, Button } from '@nextui-org/react'
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import CategoryComponent from "./Components/CategoryComponent";
import PartNumComponent from "./Components/PartNumComponent";
import ModalZebra from "./Fragments/ModalZebra";
import axios from "axios";
import ModalMesaAyuda from "./Fragments/ModalMesaAyuda";

export default function Index({ auth, unreadNotifications, data, partNumData, MAData, CategoriasMA }) {
    const [PartNums, setPartNums] = useState([]);
    const [selectedParts, setSelectedParts] = useState([]); // Para almacenar los números de parte seleccionados
    const [listPrice, setListPrice] = useState('');
    const [finalPrice, setFinalPrice] = useState('');
    const [percentage, setPercentage] = useState('');
    const [imagen, setImagen] = useState([]);
    const [desc, setDesc] = useState('');
    const [partDetails, setPartDetails] = useState([]);
    const [quantities, setQuantities] = useState({}); // Estado para almacenar cantidades
    const [partSearch, setPartSearch] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [maData, setMaData] = useState([]);
    const [selectedDataMA, setSelectedDataMA] = useState({})
    const [size, setSize] = React.useState('md')

    const sizes = ["5xl"];
    useEffect(() => {
        if (MAData) {
            setMaData(MAData);
        }
    }, [MAData]);
    

    const handleOpen = (size) => {
        setSize(size)
        onOpen();
    }
    // Maneja la busqueda del numero de parte
    const handleBuscar = async () => {
        if (!partSearch.trim()) {
            console.warn("El campo de búsqueda está vacío.");
            return;
        }
        try {
            console.log('este es lo que se mande: ', partSearch);
            // Cambia la solicitud GET para que pase el parámetro en la URL
            const response = await axios.post(route("zebra.search", { selectedParts: partSearch || "" }));
            console.log('Datos recibidos: ', response.data);
            setPartNums(response.data.partNums);

        } catch (error) {
            console.error("Error al obtener números de parte:", error);
        }
    };
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
            setPartDetails('')
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

    const handleCleanPartNums = () => {
        setSelectedParts([]);
        setListPrice(0);
        setFinalPrice(0);
        setPercentage(0);
        setImagen(0);
        setDesc(0);
        setPartDetails('')
        setSelectedDataMA({})
    }
    const handleCleanMA = (index) => {
        setSelectedDataMA((prevState) => {
            const updatedState = { ...prevState };
            delete updatedState[index]; // Eliminar el valor asociado a esta fila
            return updatedState;
        });
    }

    const handleDataSelection = (index, data) => {
        if (data) {
            setSelectedDataMA((prevState) => ({
                ...prevState,
                [index]: data.venta_usd_periodo_equipo,
            }));
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
            <div className="flex flex-col md:flex-row items-start gap-6 p-4">
                {/* Panel izquierdo: Categorías y números de parte */}
                <div className="w-full md:w-1/3 bg-white border border-gray-300 rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Selección de Productos
                    </h3>
                    <CategoryComponent
                        data={data}
                        onCategorySelect={handleCategorySelect}
                    />

                    {/* Buscador */}
                    <div class="w-full max-w-sm min-w-[200px] mb-3">
                        <div class="relative flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                class="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <input
                                class="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-10 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                                placeholder="Part Number/Número de parte..."
                                value={partSearch}
                                onChange={(e) => setPartSearch(e.target.value)}
                            />
                            <button
                                class="rounded-md text-gray-700 bg-blue-300 py-2 px-4 border border-transparent text-center text-sm transition-all shadow-md hover:shadow-lg text-white focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                                type="button"
                                onClick={() => handleBuscar()}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center items-center mt-4">
                        <button
                            onClick={handleCleanPartNums}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                            Limpiar Números de Parte
                        </button>
                    </div>
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
                        <div className="w-full flex flex-col items-center">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Imagen
                            </h3>
                            {imagen.length > 0 ? (
                                <img
                                    src={imagen} // Mostrar solo la última imagen
                                    className="w-auto max-h-[300px] object-contain border rounded"
                                />
                            ) : (
                                <p className="text-gray-600">
                                    No hay imágenes disponibles para el número de parte
                                    seleccionado.
                                </p>
                            )}
                        </div>
                        <div className="w-1/2">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Descripción
                            </h3>
                            {desc.length > 0 ? (
                                <p className="text-gray-700">{desc}</p> // Mostrar la última descripción
                            ) : (
                                <p className="text-gray-600">
                                    No hay descripción disponible para el número de parte
                                    seleccionado.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-6 p-4">
                <div className="overflow-x-auto w-full">
                    {" "}
                    {/* Se agrega un contenedor para el scroll horizontal */}
                    <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
                        <thead>
                            <tr className="bg-blue-300 text-white text-sm font-semibold uppercase">
                                <th className="py-3 px-6 text-left text-gray-700">
                                    N° Parte
                                </th>
                                <th className="py-3 px-6 text-left text-gray-700">
                                    Tipo Producto
                                </th>
                                <th className="py-3 px-6 text-left text-gray-700">Moneda</th>
                                <th className="py-3 px-6 text-left text-gray-700">
                                    Cantidad
                                </th>
                                <th className="py-3 px-6 text-left text-gray-700">
                                    Precio Lista
                                </th>
                                <th className="py-3 px-6 text-left text-gray-700">
                                    Precio Final
                                </th>
                                <th className="py-3 px-6 text-left text-gray-700">
                                    Precio mesa AYUDA
                                </th>
                                <th className="py-3 px-6 text-left text-gray-700">
                                    Descuento
                                </th>
                                <th className="py-3 px-6 text-left text-gray-700">
                                    Categoria Producto
                                </th>
                                <th className="py-3 px-6 text-left text-gray-700">
                                    Descripción
                                </th>
                                <th className="py-3 px-6 text-left text-gray-700">
                                    Select Precio mesa de AYUDA
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-800">
                            {partDetails.length > 0 ? (
                                partDetails.map((partDetail, index) => {
                                    const quantity = quantities[partDetail.partNumber] || 1;
                                    const listPrice = parseFloat(
                                        partDetail.listPrice.replace(/,/g, "")
                                    );
                                    const finalPrice = parseFloat(
                                        partDetail.finalPrice.replace(/,/g, "")
                                    );
                                    const totalListPrice = (listPrice * quantity).toFixed(2);
                                    const totalFinalPrice = selectedDataMA[index] ? ((finalPrice * quantity) + selectedDataMA[index]).toFixed(2) : (finalPrice * quantity).toFixed(2);

                                    return (
                                        <tr className="border-b hover:bg-gray-100" key={index}>
                                            <td className="py-3 px-6">{partDetail.partNumber}</td>
                                            <td className="py-3 px-6">
                                                {partDetail.dataInfo.Product_Type}
                                            </td>
                                            <td className="py-3 px-6">
                                                {partDetail.dataInfo.Currency}
                                            </td>
                                            <td className="py-3 px-6">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="w-20 border border-gray-300 rounded px-2 py-1"
                                                    value={quantity}
                                                    onChange={(e) =>
                                                        handleQuantityChange(
                                                            partDetail.partNumber,
                                                            parseInt(e.target.value) || 0
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="py-3 px-6">{totalListPrice}</td>
                                            <td className="py-3 px-6">{totalFinalPrice}</td>
                                            <td className="py-3 px-6">{selectedDataMA[index] || 0}</td>
                                            <td className="py-3 px-6">{`${partDetail.descuento}%`}</td>
                                            <td className="py-3 px-6">
                                                {partDetail.dataInfo.Product_Category}
                                            </td>
                                            <td className="py-3 px-6">
                                                {partDetail.dataInfo.Short_Marketing_Desc}
                                            </td>
                                            <td className="p-2">
                                                <div className="flex flex-col gap-4">
                                                    {/* Botón del Modal */}
                                                    <ModalMesaAyuda
                                                        MAData={maData}
                                                        index={index}
                                                        categories={CategoriasMA}
                                                        onSelectData={handleDataSelection}
                                                    />

                                                    {/* Botón de Limpiar */}
                                                    <button
                                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                        onClick={() => handleCleanMA(index)}
                                                    >
                                                        Limpiar
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="8" className="py-3 px-6 text-center">
                                        No se han seleccionado productos aún.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Botón para abrir el modal */}
            {sizes.map((size) => (
                <Button key={size} onPress={() => handleOpen(size)} color="primary">
                    Factura
                </Button>
            ))}

            {/* Aquí se integra el ModalZebra con useDisclosure */}
            <ModalZebra
                size={size}
                open={isOpen}
                close={onClose}
                partDetails={partDetails}
                quantities={quantities}
                selectedDataMA={selectedDataMA}
            />
        </AuthenticatedLayout>
    );
}