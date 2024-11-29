import React, { useEffect, useState } from "react";
import './css/PartNumComponent.css'

const PartNumComponent = ({ partNums, onPartNumSelect, listPrice, selectedParts,finalPrice, porcentaje }) => {
  return (
    <div className="partnum-container">
    {/* Título */}
    <h1>números de parte</h1>

    {/* Contenedor con barra de desplazamiento */}
    <div className="checkbox-container">
      {partNums.map((part) => (
        <div key={part.Part_Number} className="checkbox-item">
          <input
            type="checkbox"
            id={part.Part_Number}
            value={part.Part_Number}
            checked={selectedParts.includes(part.Part_Number)} // Verifica si el número de parte está seleccionado
            onChange={() => onPartNumSelect(part.Part_Number)} // Maneja la selección
            className="checkbox-input"
          />
          <label htmlFor={part.Part_Number} className="checkbox-label">{part.Part_Number}</label>
        </div>
      ))}
    </div>

     {/* Este contenedor será independiente y flotará a la derecha de la pantalla */}
      {listPrice && (
        <div className="price-container">
          <h3>Precio Lista: ${listPrice}</h3>
        </div>
      )}

      {finalPrice && (
        <div className="finalPrice-container">
          <h3>Precio Final: ${finalPrice}</h3>
        </div>
      )}

      {porcentaje && (
        <div className="discount-container">
          <h3>Descuento: {porcentaje}%</h3>
        </div>
      )}
    </div>
  );
};



export default PartNumComponent;
