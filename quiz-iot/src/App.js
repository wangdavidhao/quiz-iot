import './App.css';
import axios from 'axios'
import { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client";
const ENDPOINT = "https://quiz-iot.glitch.me/";

function App() {

  const socket = socketIOClient(ENDPOINT, { transports: ['websocket']});

  const [questions, setQuestions] = useState([]);

  const [actualIndex, setActualIndex] = useState(0);

  const [selectedIndex, setSelectedIndex] = useState(10);
  const [isCorrect, setIsCorrect] = useState("");

  const [score, setScore] = useState(0);

  const getQuestions = async () => {
    const data = await axios.get(ENDPOINT);
    setQuestions(data.data.questions);
    setActualIndex(data.data.questionIndex)
  }

  useEffect(() => {
    getQuestions();
  },[]);

  useEffect(() => {
    socket.on("nextQuestion", questionIndex => {
      setActualIndex(questionIndex);
      setSelectedIndex(10);
    });
  }, []);

  useEffect(() => {
    socket.on("answerQuestion", isCorrect => {
      setSelectedIndex(isCorrect.id);
      setIsCorrect(isCorrect.isCorrect);

      if(isCorrect.isCorrect === 'correct'){
            setScore(prev => prev+1);
      }
      
    })
  },[])

  return (
    <>
    <div className="header">
      <h1 className="numberQuestion">Question {actualIndex+1}</h1>
      <h1 className="score">Score : {score}</h1>
    </div>
    
    <div className="containerQuiz">
      <h1 className="title" >QUIZ IoT</h1>
      <h2 className="question">{questions && questions[actualIndex]?.question}</h2>
      <div className="choicesContainer">
        {questions && questions[actualIndex]?.choices.map((choice, index) => (
          <div className="choiceDiv" key={index}>
          <h4 className={`choice  color${index}`} 
            onClick={() => alert("Selectionez la réponse sur l'objet en pressant un des boutons")} >{index+1}. {choice}
          </h4>
          { selectedIndex === index && <div>
              {isCorrect === 'correct' ? <h3 className="correct" >CORRECT</h3> : <h3 className="incorrect">INCORRECT</h3>}
            </div>}
          </div>   
          ))}
      </div>
      
    </div>
    <div className="nextContainer">
        <h5>Sandra Tang - Cyril Bopoungo - David Wang</h5>
        <h4 className="next">Next</h4>
    </div>
    </>


  );
}

export default App;
