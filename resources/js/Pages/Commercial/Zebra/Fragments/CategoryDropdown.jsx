import React, { useState } from "react";

export function CategoryDropdown({ categories, onCategorySelect }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCheckboxChange = (event) => {
    const category = event.target.value;
    const isChecked = event.target.checked;

    const updatedCategories = isChecked
      ? [...selectedCategories, category]
      : selectedCategories.filter((selected) => selected !== category);

    setSelectedCategories(updatedCategories);

    if (onCategorySelect) {
      onCategorySelect(updatedCategories); // Pasar categorías seleccionadas al padre
    }
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
          ? selectedCategories.join(", ")
          : "-- Selecciona categorías --"}
        <span className="float-right text-gray-500">&#9660;</span>
      </button>

      {/* Menú desplegable */}
      {isDropdownOpen && (
        <div className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-md w-full mt-1">
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

export default CategoryDropdown;
