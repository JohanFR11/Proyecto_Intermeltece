import React, { useState } from "react";

export function CategoryDropdown({ categories, onCategorySelect }) {
    const [selectedCategories, setSelectedCategories] = useState([""]); // "Todos los datos" seleccionado por default
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleCheckboxChange = (event) => {
        const category = event.target.value;
        const isChecked = event.target.checked;

        let updatedCategories;

        if (category === "") {
            // Si se selecciona "Todos los datos"
            updatedCategories = isChecked ? [""] : [];
        } else {
            // Si se selecciona cualquier otra categoría
            updatedCategories = isChecked
                ? selectedCategories.filter((cat) => cat !== "").concat(category)
                : selectedCategories.filter((cat) => cat !== category);

            // Si no quedan categorías seleccionadas, volver a seleccionar "Todos los datos"
            if (updatedCategories.length === 0) {
                updatedCategories = [""];
            }
        }

        setSelectedCategories(updatedCategories);
        if (onCategorySelect) {
            onCategorySelect(updatedCategories.join(",")); // Enviar categorías seleccionadas o vacío
        }
        
        setIsDropdownOpen(false);
    };

    return (
        <div className="relative w-full">
            {/* Botón para abrir el menú */}
            <button
                type="button"
                className="w-full bg-gray-100 border border-gray-300 text-gray-700 rounded-lg px-4 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={toggleDropdown}
            >
                {selectedCategories.length > 0
                    ? selectedCategories.includes("")
                        ? "Todos los datos"
                        : selectedCategories.join(", ")
                    : "-- Selecciona categorías --"}
                <span className="float-right text-gray-500">&#9660;</span>
            </button>

            {/* Menú desplegable */}
            {isDropdownOpen && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-md w-full mt-1 max-h-60 overflow-y-auto">
                    <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        <input
                            type="checkbox"
                            value=""
                            checked={selectedCategories.includes("")}
                            onChange={handleCheckboxChange}
                            className="mr-2"
                        />
                        Todos los datos
                    </label>
                    {categories.map((category, index) => (
                        <label
                            key={index}
                            className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                value={category}
                                checked={selectedCategories.includes(category)}
                                onChange={handleCheckboxChange}
                                className="mr-2"
                            />
                            {category}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
