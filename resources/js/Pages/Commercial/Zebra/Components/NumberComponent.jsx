import React from "react";
import NumberList from "../Fragments/NumberList";


const NumeroComponente = ({number, onPartNumSelect, listPrice, selectedParts}) => {
    const numeros = number.map((item) => item.Part_Number); // Asegúrate de que 'Part_Number' exista en cada item

    return (
        <div>
            <h1>Selecciona el numero de parte</h1>
            <NumberList
                numeros={numeros} // Pasa solo los números de parte al componente hijo
                onPartNumSelect={onPartNumSelect}
                selectedParts={selectedParts}
                listPrice={listPrice}
            />
        </div>
    );
}


export default NumeroComponente;