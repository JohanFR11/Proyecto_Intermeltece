import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const FirmaSuperior = ({ onSave, onClose}) => {
    const sigCanvas = useRef(null);
    const [firmaUsu, setFirmaSupe] = useState(null);

    const guardarfirma = async () => {
        if (sigCanvas.current) {
            const firmaBlob = await new Promise(resolve => sigCanvas.current.getCanvas().toBlob(resolve, "image/png"));
            const formData = new FormData();
            formData.append("firma", firmaBlob, "firma.png");

            try {

                const response = await axios.post("http://127.0.0.1:8000/guardar-firma/superior", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                const data = response.data.url;
                console.log(data);
                onSave(data); // Guarda la URL en lugar del base64
                setFirmaSupe(data);
                
            } catch (error) {
                console.error("Error al guardar la firma:", error);
            }
        }
    };


    const limpiar = () => {
        sigCanvas.current.clear();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg shadow-lg">
                <h2 className="text-xl font-bold mb-2">Firma aquí</h2>
                <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ className: "border w-96 h-48" }} />
                <div className="mt-3 flex justify-between">
                    <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={limpiar}>Borrar</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={guardarfirma}>Guardar</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    )
}

export default FirmaSuperior;