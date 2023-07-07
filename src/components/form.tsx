import { useState } from "react";

interface run {
	name: string;
	distance: number;
	time: number;
}

const runTolken = "run";

function getRuns(): run[] {
	const runs = localStorage.getItem(runTolken) ?? "[]";
	return JSON.parse(runs);
}

function setRuns(runs: run[]): void {
	const sRuns = JSON.stringify(runs);
	localStorage.setItem(runTolken, sRuns);
}

export default function Form() {
	const [distance, setDistance] = useState(0);
	const [time, setTime] = useState(0);
	const [runName, setRunName] = useState("");

	const runs = getRuns();

	function saveRun(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		event.preventDefault();
		const runData = { distance, time, name: runName };

		runs.push(runData);
		setRuns(runs);
	}

	return (
		<form className="flex flex-col gap-4 items-baseline w-fit m-auto">
			<label>
				Distance (Km)
				<input
					id="distance"
					type="number"
					value={distance}
					onChange={(e) => setDistance(+e.currentTarget.value)}
				/>
			</label>
			<label>
				Time (minutes)
				<input
					id="time"
					type="number"
					value={time}
					onChange={(e) => setTime(+e.currentTarget.value)}
				/>
			</label>
			<label>
				Run name (optinal)
				<input
					id="run-name"
					type="text"
					value={runName}
					onChange={(e) => setRunName(e.currentTarget.value)}
				/>
			</label>
			<button onClick={saveRun}>save run</button>
		</form>
	);
}
