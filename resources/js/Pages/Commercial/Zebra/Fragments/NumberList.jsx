import React, { useState } from "react";

export default function NumberList({ numeros, onCategorySelect }) {
    const [selectedCategory, setSelectedCategory] = useState([]);

    const handleChange = (event) => {
        const selectedNum = event.target.value;

        // Actualiza la lista de números seleccionados
        const updatedSelection = selectedCategory.includes(selectedNum)
            ? selectedCategory.filter((num) => num !== selectedNum)
            : [...selectedCategory, selectedNum];

        setSelectedCategory(updatedSelection);

        // Llama al callback proporcionado por el padre con los números seleccionados
        if (onCategorySelect) {
            onCategorySelect(updatedSelection);
        }
    };

    return (
        <div>
            <label htmlFor="NumberList" className="block text-sm font-semibold text-gray-700">
                Número de parte
            </label>
            {/* Cambié max-h-52 por max-h-32 para hacer el contenedor más corto */}
            <div style={{ maxHeight: '150px', maxWidth: '340px',overflowY: 'auto', padding: '8px', border: '1px solid #ccc' }}>
                <ul className="list-none p-0">
                    {numeros && numeros.length > 0 ? (
                        numeros.map((partNumber, index) => (
                            <li key={index} className="mb-2">
                                <input
                                    type="checkbox"
                                    value={partNumber} // Usa el número de parte directamente
                                    onChange={handleChange}
                                    checked={selectedCategory.includes(partNumber)} // Marca como seleccionado si ya está en `selectedCategory`
                                    className="mr-2"
                                />
                                {partNumber} {/* Muestra el número de parte */}
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
