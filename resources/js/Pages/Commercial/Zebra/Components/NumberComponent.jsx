import React from "react";
import NumberList from "../Fragments/NumberList";
import TodosDatos from "../Fragments/TodosDatos";

const NumeroComponente = ({ number, onPartNumSelect, listPrice, selectedParts, datosporsi, finalPrice, porcentaje}) => {
    // Validar si la lista está vacía o no definida
    if (!number || number.length === 0) {
        const todoeso = datosporsi.map((itemx) => itemx.Part_Number);
        console.log('aDAdaDAda',datosporsi);
        return (
            <div>
                <TodosDatos
                    todosnum = {todoeso}
                    onPartNumSelect={onPartNumSelect}
                    selectedParts={selectedParts}
                    listPrice={listPrice}
                    finalPrice={finalPrice}
                    porcentaje={porcentaje}
                />
            </div>
        );
    }

    // Mapear los números de parte si la lista no está vacía
    const numeros = number.map((item) => item.Part_Number); // Asegúrate de que 'Part_Number' exista en cada item

    return (
        <div>
            <h1>Selecciona el número de parte</h1>
            <NumberList
                numeros={numeros} // Pasa solo los números de parte al componente hijo
                onPartNumSelect={onPartNumSelect}
                selectedParts={selectedParts}
                listPrice={listPrice}
                finalPrice={finalPrice}
                porcentaje={porcentaje}
            />
        </div>
    );
};

export default NumeroComponente;
