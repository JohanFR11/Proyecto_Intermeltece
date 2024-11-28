import React from 'react';
import PartNumDropdown from '../Fragments/PartNumDropdown';

const PartNumComponent = ({ partNums }) => {
  // Mapear números de parte
  const Nums = partNums?.map((item) => item.Part_Number) || [];

  // Manejar la selección de un número de parte
  const handlePartNumSelect = (selectedPartNum) => {
    console.log('Número de parte seleccionado:', selectedPartNum);
  };

  return (
    <div>
      <h1>Selecciona un número de parte</h1>
      <PartNumDropdown 
        PartNum={Nums} 
        onPartNumSelect={handlePartNumSelect} 
      />
    </div>
  );
};

export default PartNumComponent;
