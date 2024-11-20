import React, { useState } from 'react';

const PreciosUlefone = ({ data }) => {
    const isDataAvailable = Array.isArray(data) && data.length > 0;
    const precioGold = "PRECIO_UNITARIO_CANAL_GOLD_Facturacion_entre_50-99_Millones";
    const precioSilver ="PRECIO_UNITARIO_CANAL_SILVER_Facturacion_Mayor_a_0-49_Millones";
    return (
        <div className="container">
            
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Modelo</th>
                        <th>Moneda</th>
                        <th>Precio Unitario Canal Platinum</th>
                        <th>Precio Unitario Canal Gold</th>
                        <th>Precio Unitario Canal Silver</th>
                        <th>Precio Unitario Seguridad Física/Corporativo</th>
                        <th>Precio Unitario Cliente Final</th>
                    </tr>
                </thead>
                <tbody>
                    {isDataAvailable ? (
                        data.map((item, index) => (
                            <tr key={index}>
                                <td>{item.MODELO}</td>
                                <td>{item.MONEDA}</td>
                                <td>{item.PRECIO_UNITARIO_CANAL_PLATINUM_Facturacion_Mayor_a_100_Millones}</td>
                                <td>{item[precioGold]}</td>
                                <td>{item[precioSilver]}</td>
                                <td>{item.PRECIO_UNITARIO_SEGURIDAD_FISICA_O_CORPORATIVO_PAGO_A_CREDITO}</td>
                                <td>{item.PRECIO_UNITARIO_CLIENTE_FINAL}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                No hay datos disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PreciosUlefone;