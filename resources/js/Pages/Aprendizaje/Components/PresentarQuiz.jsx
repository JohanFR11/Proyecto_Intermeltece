import axios from "axios";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Hacer validacion de si existe un quizid para saltarse la peticion de iniciar intento

export default function PresentarQuiz({ token }) {
    const location = useLocation();
    const { quizid } = location.state || {};
    const [attemptId, setAttemptId] = useState([]);
    const [quizContent, setQuizContent] = useState([]);

    // useEffect(() => {

    //     const startQuizAttempt = async () => {

    //         try {
    //             const response = await axios.get(`/moodle/quiz/attempt/${quizid}`);

    //             setAttemptId(response.data.attempt.id)
    //             console.log(response.data.attempt.id)
    //         } catch (error) {
    //             console.error('error al iniciar el intento: ', error)
    //         }

    //     };

    //     startQuizAttempt();
    // }, []);

    // useEffect(() => {
    //     const getQuizContent = async () => {
    //         try {
    //             const response = await axios.get(`/moodle/quiz/data/${4}`);

    //             const content = response.data.questions;

    //             console.log(content);
    //             setQuizContent(content);
    //         } catch (error) {
    //             console.error("error al obtener el contenido del quiz: ", error);
    //         }
    //     };
    //     getQuizContent();
    // }, []);

    // const handleSubmit = () => {
    //     // Seleccionamos todos los contenedores de pregunta, asumiendo que cada uno tiene la clase "que"
    //     const questionElements = document.querySelectorAll('.que');
    //     const responses = [];

    //     questionElements.forEach((questionElement) => {
    //         // Buscamos el input radio que esté seleccionado dentro de la pregunta
    //         const checkedInput = questionElement.querySelector('input[type="radio"]:checked');

    //         if (checkedInput) {
    //             responses.push({
    //                 questionName: checkedInput.name,
    //                 answer: checkedInput.value,
    //             });
    //         } else {
    //             // Si no se seleccionó respuesta para esa pregunta
    //             responses.push({
    //                 questionName: checkedInput.name,
    //                 answer: null,
    //             });
    //         }
    //     });

    //     // Aquí puedes enviar el array "responses" a tu backend o manejarlo según necesites
    //     console.log("Respuestas recopiladas:", responses);
    // };



    return (
        <div className="flex flex-col items-center">
            {/* {quizContent &&
                quizContent.map((question, index) => (
                    <div key={index}>
                        <ExternalHTMLRenderer rawHTML={question.html} />
                    </div>
                ))}
            <button
                onClick={handleSubmit}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Enviar Respuestas
            </button> */}
        </div>
    );
}
