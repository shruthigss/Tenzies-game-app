/*https://joyful-daifuku-af4cd4.netlify.app*/

import React from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import "./App.css"
import Confetti from "react-confetti"
export default function App() {

    const [dice, setDice] = React.useState(allNewDice());
    const [tenzies, setTenzies] = React.useState(false);
    const [score, setScore] = React.useState(1);
    const [bestScore, setBestScore] = React.useState(15);

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            if (score < bestScore) {
                setBestScore(prevscore => prevscore = score)
                console.log(`bestScore ${bestScore}`)
            }
            setTenzies(true);
            setScore(prevscore => prevscore = 0);
            console.log("You won!")
        }   
    }, [dice])

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
        if (!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ?
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
        }
        setScore(prevscore => prevscore + 1);
        //console.log(`score ${score}`);

    }
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die
        }))
    }
    const currentScore = localStorage.setItem("clicks", JSON.stringify(score));
    const showScore = localStorage.setItem("bestScore", JSON.stringify(bestScore));

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
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
            <div className="clicksinfo">{score}</div>
            {bestScore && <div>Best Score : {bestScore}</div>}
        </main>
    )
}