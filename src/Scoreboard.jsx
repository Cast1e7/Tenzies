import React from "react"

export default function Scoreboard(props) {
    return (
        <div className={props.title ===  "⭐Top Score" ? "scoreboard top": "scoreboard bot"}>
            <h3 className="scoreboard--title">{props.title}</h3>
            <p>Rolls: {props.value.rolls || "-"}</p>
            <p>Time: {props.value.time === 0 ? "-" : `${props.value.time}s`}</p>
        </div>
    )
}