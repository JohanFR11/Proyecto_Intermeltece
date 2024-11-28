import React, { useState } from "react";

export function PartNumDropdown({ PartNum, onPartNumSelect }) {
    const [selectedPartNum, setSelectedPartNum] = useState("");

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedPartNum(selectedValue);

        if (onPartNumSelect) {
            onPartNumSelect(selectedValue);
        }
    };
    return(
        <div className="form-group">
            <label htmlFor="PartNumDropdown">Selecciona un número de parte:</label>
            <select
                id="PartNumDropdown"
                className="form-control"
                value={selectedPartNum}
                onChange={handleChange}
            >
                <option value="">-- Selecciona un número de parte --</option>
                {PartNum.map((Num, index) => (
                    <option key={index} value={Num}>
                        {Num}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default PartNumDropdown;
