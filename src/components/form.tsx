import { useState } from "react";

export default function Form() {
    const [distance, setDistance] = useState(0)
    const [time, setTime] = useState(0)
    const [runName, setRunName] = useState("")

	function saveRun(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		event.preventDefault();
        const runData = JSON.stringify({distance, time})

		localStorage.setItem(runName, runData )
        const data = localStorage.getItem(runName)
        if( data) console.log(JSON.parse(data))
	}

	return (
		<form className="flex flex-col gap-4 items-baseline w-fit m-auto">
			<label>
				Distance (Km)
				<input id="distance" type="number" value={distance} onChange={(e)=>setDistance(+e.currentTarget.value)} />
			</label>
			<label>
				Time (minutes)
				<input id="time" type="number" value={time} onChange={(e)=>setTime(+e.currentTarget.value)}/>
			</label>
			<label>
				Run name (optinal)
				<input id="run-name" type="text" value={runName} onChange={(e)=>setRunName(e.currentTarget.value)}/>
			</label>
			<button onClick={saveRun}>save run</button>
		</form>
	);
}
