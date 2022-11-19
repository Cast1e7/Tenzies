import {useState, useEffect, useRef} from "react"
import Die from "./Die"
import Scoreboard from "./Scoreboard"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [rolls, setRolls] = useState(1)
    const [bestScore, setBestScore] = useState(
        JSON.parse(localStorage.getItem("bestScore")) || {rolls: null, time: 0}
        )
    const [isActive, setIsActive] = useState(true)
    const [time, setTime] = useState(0)
    
    const interval = useRef()
    
    useEffect(() => {
        if (isActive) {
        interval.current = setInterval(() => {
            setTime((prevTime) => prevTime + 1)
            }, 1000)
        } else {
        clearInterval(interval.current)
        }
        return () => {
        clearInterval(interval.current);
        }
    }, [isActive])
    
  
    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            setIsActive(false)
        }
    }, [dice])
    
    
    useEffect(() => {
        if(tenzies) {
            if(bestScore.rolls === null || rolls < bestScore.rolls) {
                setBestScore(prevBest => ({...prevBest, rolls: rolls}))
            }
            if(bestScore.time === 0 || time < bestScore.time) {
                setBestScore(prevBest => ({...prevBest, time: time}))
            } 
        }    
    }, [tenzies])
    
    
    useEffect(() => {
        localStorage.setItem("bestScore", JSON.stringify(bestScore))
    }, [bestScore])


    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            dice.every(die => die.isHeld) ? "" : setRolls(prevRolls => prevRolls + 1)
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRolls(1)
            setIsActive(true)
            setTime(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <div className="game-top">
                <h1 className="title">Tenzies</h1>
                <Scoreboard title="⭐Top Score" 
                value={{rolls: bestScore.rolls, time: bestScore.time}}/>
            </div>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <Scoreboard title="Current Score" 
            value={{rolls: rolls, time: time}}/>
            <p className="img-desc">Photo by Annie Spratt on Unsplash</p>
        </main>
    )
}