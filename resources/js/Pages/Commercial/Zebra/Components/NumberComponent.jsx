import React from "react";
import NumberList from "../Fragments/NumberList";


const NumeroComponente = ({number})=>{
    
    const numeros = number.map((item) => item.Part_Number);

    const handleCategorySelect = (selectedCategory) =>{
        console.log('Los numeros de partes son: ', selectedCategory)
    }

    return(
        <div>
            <h1>
                Selecciona el numero de parte
            </h1>
            <NumberList
                numeros={numeros}
                onCategorySelect = {handleCategorySelect}
            />
        </div>
    )

}

export default NumeroComponente;