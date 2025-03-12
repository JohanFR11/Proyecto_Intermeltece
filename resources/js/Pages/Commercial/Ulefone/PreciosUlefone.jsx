import React, { useState, useEffect } from 'react';
import { useDisclosure, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react'
import axios from 'axios';
import ModalDataModelo from './Components/ModalInfoModelo';
import Ulefone from './Image/Ulefone.png';

const PreciosUlefone = ({ data, odata }) => {
    const isDataAvailable = Array.isArray(data) && data.length > 0;
    const [stockData, setStockData] = useState({});
    const [odataData, setOdataData] = useState(odata.data || []);
    const [loading, setLoading] = useState(false);
    const precioGold = "PRECIO_UNITARIO_CANAL_GOLD_Facturacion_entre_50-99_Millones";
    const precioSilver = "PRECIO_UNITARIO_CANAL_SILVER_Facturacion_Mayor_a_0-49_Millones";
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [size, setSize] = React.useState('md');
    const [modeloUlefone, setModelo] = useState('');

    const sizes = ["5xl"];

    const handleOpen = (modelo, size) => {
        /* console.log(modelo) */
        setSize(size)
        setModelo(modelo)
        onOpen();
    }

    const fetchOdata = async (modelo) => {
        if (!modelo) return;

        setLoading(true);
        try {
            const response = await axios.get('/commercial/ulefone/odata', {
                params: { modelo: modelo }
            });

            /* console.log('Datos recibidos de OData:', response.data); */

            if (response.data.code === 200) {
                setOdataData(response.data.data);

                const stockInfo = response.data.data.reduce((acc, item) => {
                    if (item.TLOG_AREA_UUID === "Bogota Disponible") {
                        acc[item.CMATERIAL_UUID] = item.KCON_HAND_STOCK;
                    }
                    return acc;
                }, {});

                /* console.log('Stock de datos actualizados:', stockInfo); */
                setStockData((prevData) => ({
                    ...prevData,
                    ...stockInfo
                }));
            } else {
                console.error('Error al obtener datos de OData:', response.data);
            }
        } catch (error) {
            console.error('Error al llamar la API OData:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        data.forEach(item => {
            fetchOdata(item.MODELO);
            /*  HandelModalDateModelo(item.MODELO) */
        });
    }, [data]);
    /* 
        console.log('datos del datosmodel',DatosModelo) */

    return (
        <div className="items-center">
            <div className="flex justify-center">
                <a href='https://ulefone.com.co/?gad_source=1&gclid=CjwKCAiA-ty8BhA_EiwAkyoa3wqdtfbAo4goLrUBlfddtpXx8K9nMyC_J3tVn5dyPF1O66GowGf2RBoC7HIQAvD_BwE' target="_blank" rel="noopener noreferrer"><img className="rounded-3xl shadow-2xl scale-95 transition-transform duration-300 hover:scale-110" src={Ulefone} width={300} height={50}/></a>
            </div>
            <div className="mr-4 p-4 overflow-x-auto">
                <table className=" bg-white border border-gray-300 rounded-lg shadow-md">
                    <thead className="bg-blue-50 text-gray-600 uppercase text-xs leading-normal">
                        <tr>
                            <th className="py-3 px-4 text-center">Modelo</th>
                            <th className="py-3 px-4 text-center">Stock Disponible</th>
                            <th className="py-3 px-4 text-center">Moneda</th>
                            <th className="py-3 px-4 text-center">Precio Unitario Canal Platinum</th>
                            <th className="py-3 px-4 text-center">Precio Unitario Canal Gold</th>
                            <th className="py-3 px-4 text-center">Precio Unitario Canal Silver</th>
                            <th className="py-3 px-4 text-center">Precio Unitario Seguridad Física/Corporativo</th>
                            <th className="py-3 px-4 text-center">Precio Unitario Cliente Final</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                    {isDataAvailable ? (
                        data.map((item, index) => (
                            <tr key={index} 
                            className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 cursor-pointer`}
                             onClick={() => handleOpen(item.MODELO, sizes)}
                             >
                            
                                <td className="py-3 px-4 text-left w-[400px]"> {item.MODELO} </td>
                                <td className="py-3 px-4 text-center w-[30px]">{parseInt(stockData[item.MODELO] !== undefined ? stockData[item.MODELO] : 0)}</td>
                                <td className="py-3 px-4 text-center">{item.MONEDA}</td>
                                <td className="py-3 px-4 text-center">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.PRECIO_UNITARIO_CANAL_PLATINUM_Facturacion_Mayor_a_100_Millones)}</td>
                                <td className="py-3 px-4 text-center">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item[precioGold])}</td>
                                <td className="py-3 px-4 text-center">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item[precioSilver])}</td>
                                <td className="py-3 px-4 text-center">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.PRECIO_UNITARIO_SEGURIDAD_FISICA_O_CORPORATIVO_PAGO_A_CREDITO)}</td>
                                <td className="py-3 px-4 text-center">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.PRECIO_UNITARIO_CLIENTE_FINAL)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="text-center py-3 px-4">
                                No hay datos disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>

                <ModalDataModelo modeloUlefone={modeloUlefone} size={size} open={isOpen} close={onClose} />
            </div>
        </div>
    );
};

export default PreciosUlefone;
