import React from 'react';
import { CategoryDropdown } from '../Fragments/CategoryDropdown';

const CategoryComponent = ({data, onCategorySelect}) => {

  const categories = data.map((item) => item.subcategoria)|| [];


  const handleCategorySelect = (selectedCategory) => {
    if (onCategorySelect) {
      onCategorySelect(selectedCategory); // Pasar al componente padre
    }
  };
  return (
    <div>
      <h1>Selecciona una Categoría</h1>
      <CategoryDropdown 
        categories={categories} 
        onCategorySelect={handleCategorySelect} 
      />

    </div>
  );
};

export default CategoryComponent;