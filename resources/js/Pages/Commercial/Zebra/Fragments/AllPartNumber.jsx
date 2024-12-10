import React from "react";

export default function AllPartNumber({todosnum, onPartNumSelect, selectedParts})
{
    return (
        <div>
          <label htmlFor="NumberList" className="block text-sm font-semibold text-gray-700">
            Número de parte
          </label>
          <div style={{ maxHeight: '200px', maxWidth: '340px', overflowY: 'auto', padding: '8px', border: '1px solid #ccc' }}>
            <ul className="list-none p-0">
              {todosnum && todosnum.length > 0 ? (
                todosnum.map((partNumber, index) => (
                  <li key={index} className="mb-2">
                    <input
                      id={partNumber} // Aquí solo usas 'partNumber' porque es solo el valor de Part_Number
                      type="checkbox"
                      value={partNumber} // Usa el valor directamente
                      onChange={() => onPartNumSelect(partNumber)} // Llama a onPartNumSelect con el número de parte
                      checked={selectedParts.includes(partNumber)} // Marca el checkbox si 'selectedParts' incluye el número
                      className="mr-2"
                    />
                    {partNumber} {/* Aquí solo muestras el número de parte */}
                  </li>
                ))
              ) : (
                <li>No hay números de parte disponibles.</li>
              )}
            </ul>
            </div>
        </div>
      );
}