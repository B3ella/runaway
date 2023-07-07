import { setRuns, getRuns, run } from "./localStorageManager";
import { useEffect, useState } from "react";

function Form({ addRun }: { addRun: (arg: run) => void }) {
	const [distance, setDistance] = useState(0);
	const [time, setTime] = useState(0);
	const [runName, setRunName] = useState("");

	function resetValues() {
		setDistance(0);
		setTime(0);
		setRunName("");
	}

	function saveRun(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		event.preventDefault();

		const runData = { distance, time, name: runName };
		addRun(runData);

		resetValues();
	}

	type changeEvent = React.ChangeEvent<HTMLInputElement>;
	const changeDistance = (e: changeEvent) => setDistance(+e.target.value);
	const changeTime = (e: changeEvent) => setTime(+e.target.value);
	const changeRunName = (e: changeEvent) => setRunName(e.target.value);

	return (
		<form className="flex flex-col gap-4 items-baseline w-fit m-auto">
			<label>
				Distance (Km)
				<input
					type="number"
					value={distance}
					onChange={changeDistance}
				/>
			</label>
			<label>
				Time (minutes)
				<input type="number" value={time} onChange={changeTime} />
			</label>
			<label>
				Run name
				<input type="text" value={runName} onChange={changeRunName} />
			</label>
			<button onClick={saveRun}>save run</button>
		</form>
	);
}
function RunLi({ name, distance, time }: run) {
	const meanVelocity = (distance / time) * 60;
	const key = `${name}${time}${meanVelocity}`;
	return (
		<li className="flex justify-between w-1/3" key={key}>
			<h3>{name}</h3>
			<p>distance: {distance} km</p>
			<p>time: {time} min</p>
			<p>Mean Velocity: {meanVelocity} km/h</p>
		</li>
	);
}

function DataVisualizer({ runs }: { runs: run[] }) {
	const runComp = runs.map(RunLi);

	return <ul className="flex flex-col items-center p-16">{runComp}</ul>;
}

export default function FormAndVisualizer() {
	const [runs, setRunState] = useState<run[]>([]);

	function addRun(run: run) {
		setRunState([...runs, run]);
		setRuns(runs);
	}

	useEffect(() => {
		setRunState(getRuns());
	}, []);

	return (
		<section className="h-screen font-mono " id="get-started">
			<h2 className="text-3xl py-14 text-center">
				Fill with your latest runs
			</h2>
			<Form addRun={addRun} />
			<DataVisualizer runs={runs} />
		</section>
	);
}
