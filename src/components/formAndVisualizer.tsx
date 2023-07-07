import { setRuns, getRuns, run } from "./localStorageManager";
import { useEffect, useState } from "react";

function Form() {
	const [distance, setDistance] = useState(0);
	const [time, setTime] = useState(0);
	const [runName, setRunName] = useState("");

	function resetValues() {
		setDistance(0);
		setTime(0);
		setRunName("");
	}

	const runs = getRuns();

	function saveRun(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		event.preventDefault();
		const runData = { distance, time, name: runName };

        resetValues()
		runs.push(runData);
		setRuns(runs);
	}

	return (
		<form className="flex flex-col gap-4 items-baseline w-fit m-auto">
			<label>
				Distance (Km)
				<input
					type="number"
					value={distance}
					onChange={(e) => setDistance(+e.currentTarget.value)}
				/>
			</label>
			<label>
				Time (minutes)
				<input
					type="number"
					value={time}
					onChange={(e) => setTime(+e.currentTarget.value)}
				/>
			</label>
			<label>
				Run name (optinal)
				<input
					type="text"
					value={runName}
					onChange={(e) => setRunName(e.currentTarget.value)}
				/>
			</label>
			<button onClick={saveRun}>save run</button>
		</form>
	);
}
function RunLi({ name, distance, time }: run) {
	const meanVelocity = (distance / time) * 60;

	return (
		<li
			className="flex justify-between w-1/3"
			key={`${name}${time}${meanVelocity}`}
		>
			<h3>{name}</h3>
			<p>distance: {distance} km</p>
			<p>time: {time} min</p>
			<p>Mean Velocity: {meanVelocity} km/h</p>
		</li>
	);
}

function DataVisualizer() {
	let [runs, setRun] = useState<run[]>([]);
	useEffect(() => {
		setRun(getRuns());
	}, []);
	const runComp = runs.map(RunLi);

	return <ul className="flex flex-col items-center p-16">{runComp}</ul>;
}

export default function FormAndVisualizer() {
	return (
		<section className="h-screen font-mono " id="get-started">
			<h2 className="text-3xl py-14 text-center">
				Fill with your latest runs
			</h2>
			<Form />
			<DataVisualizer />
		</section>
	);
}
