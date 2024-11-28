import React from 'react';
import { CategoryDropdown } from '../Fragments/CategoryDropdown';


const CategoryComponent = ({ data,onCategorySelect }) => {

  const categories = data?.map((item) => item.subcategorias) || [];

  const handleCategorySelect = (selectedCategory) => {
      if (onCategorySelect) {
        onCategorySelect(selectedCategory); // Pasar al componente padre
      }
  };


  return (
    <div>
      <CategoryDropdown 
        categories={categories} 
        onCategorySelect={handleCategorySelect} 
      />
    </div>
  );
};

export default CategoryComponent;
