import Pip from "./Pip"

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white",
        boxShadow: props.isHeld ? "inset 0 2px #59E391, inset 0 -2px #50cc83, inset 2px 0 #47b674, inset -2px 0 #47b674" : ""
    }
    
    const pipsElements = new Array(props.value).fill(0).map((_, i) => <Pip key={i} />)

    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            {pipsElements}
        </div>
    )
}