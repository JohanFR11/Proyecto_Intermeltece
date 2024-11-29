import React, { useState } from "react";

export function CategoryDropdown({ categories, onCategorySelect }) {
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleChange = (event) => {
      const selectedValue = event.target.value;
      setSelectedCategory(selectedValue);
  
      if (onCategorySelect) {
        onCategorySelect(selectedValue); // Llamamos al callback correctamente
      }
    };

    return (
        <div className="form-group">
            <label htmlFor="categoryDropdown">Selecciona una categoría:</label>
            <select
                id="categoryDropdown"
                className="form-control"
                value={selectedCategory}
                onChange={handleChange}
            >
                <option value="" disabled>-- Selecciona una categoría --</option>
                <option value="1"></option>
                {categories.map((category, index) => (
                    <option key={index} value={category}>
                        {category}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default CategoryDropdown;
