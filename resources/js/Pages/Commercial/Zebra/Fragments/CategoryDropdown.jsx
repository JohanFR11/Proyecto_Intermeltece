import React, { useState } from "react";

export function CategoryDropdown({ categories,onCategorySelect }) {
    const [selectedCategory, setSelectedCategory] = useState("");

    const handleChange = (event) => {
        const selectedName = event.target.value;
        setSelectedCategory(selectedName);

        // Llama al callback proporcionado por el padre
        if (onCategorySelect) {
            onCategorySelect(selectedName);
        }
    };

    return (
        <div className="form-group">
            <select
                id="categoryDropdown"
                className="form-control"
                value={selectedCategory}
                onChange={handleChange}
            >
                <option value="">-- Selecciona una categoría --</option>
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