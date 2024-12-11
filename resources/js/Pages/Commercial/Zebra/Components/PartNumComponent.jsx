import React from "react";
import NumberList from "../Fragments/NumberList";
import AllPartNumber from "../Fragments/AllPartNumber";

const PartNumComponent = ({ partNums, onPartNumSelect, selectedParts,allData }) => {



  if (!partNums || partNums.length === 0) {
    const allPartNums = allData.map((item) => item.Part_Number);
    return (
        <div>
            <AllPartNumber 
            todosnum = {allPartNums}
            onPartNumSelect={onPartNumSelect}
            selectedParts={selectedParts}/>
        </div>
    );
  }
//   console.log('este es el numero de parte dado en el cuadro de busqueda: ', partNums)
  // Mapear los números de parte si la lista no está vacía
  const numeros = partNums.map((item) => item.Part_Number); 

  return (
    <div>
        <h1>Selecciona el número de parte</h1>
    
        <NumberList
            numeros={numeros} // Pasa solo los números de parte al componente hijo
            onPartNumSelect={onPartNumSelect}
            selectedParts={selectedParts}
        />
    </div>
);
};

export default PartNumComponent;
