import React from 'react';
import { CategoryDropdown } from '../Fragments/CategoryDropdown';


const CategoryComponent = ({ data,onCategorySelect }) => {

  const categories = data?.map((item) => item.subcategorias) || [];


  return (
    <div className="mb-4">
    <h1 className="text-lg font-semibold mb-2">Selecciona una Categoría</h1>
    <CategoryDropdown 
      categories={categories} 
      onCategorySelect={onCategorySelect} 
    />
  </div>
  );
};

export default CategoryComponent;
