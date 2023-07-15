import {
	getRuns,
	addRunToLocalStorage,
	removeRunFromLocalStorage,
	type run,
	NamelessRun,
	getStoredGoalRun,
} from "./localStorageManager";
import { useEffect, useState } from "react";
import { formatDateToString } from "./dateHelper";
import Graph from "./graph";
import calcSpeed from "./calcSpeed";

function Form({ addNewRun }: { addNewRun: (arg: run) => void }) {
	const [distance, setDistance] = useState(0);
	const [time, setTime] = useState(0);
	const [runName, setRunName] = useState("");
	const [date, setDate] = useState(new Date());

	function resetValues() {
		setDistance(0);
		setTime(0);
		setRunName("");
	}

	type changeEvent = React.ChangeEvent<HTMLInputElement>;
	const changeDistance = (e: changeEvent) => setDistance(+e.target.value);
	const changeTime = (e: changeEvent) => setTime(+e.target.value);
	const changeRunName = (e: changeEvent) => setRunName(e.target.value);
	const changeDate = (e: changeEvent) => setDate(new Date(e.target.value));

	function saveRun(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		event.preventDefault();

		const runData = { distance, time, name: runName, date };
		addNewRun(runData);

		resetValues();
	}
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
			<label>
				date{" "}
				<input
					type="date"
					value={formatDateToString(date)}
					onChange={changeDate}
				/>
			</label>
			<button onClick={saveRun}>save run</button>
		</form>
	);
}

type DeleteRun = (arg: run) => void;

function RunLi(run: run, deleteRun: DeleteRun, goalRun: NamelessRun) {
	const { name, distance, time, date } = run;

	const meanVelocity = calcSpeed(run);
	const goalVelocity = calcSpeed(goalRun);
	const distanceToGoal = Math.max(goalRun.distance - distance, 0);
	const timeToGoal = Math.max(time - goalRun.time, 0);

	const key = `${name}${time}${meanVelocity}${formatDateToString(date)}`;

	return (
		<li className="flex flex-col justify-between lg:w-1/3" key={key}>
			<h3>{name}</h3>
			<p>distance: {distance} km</p>
			<p>Distance To Goal: {distanceToGoal} km</p>
			<p>time: {time} min</p>
			<p>Time above Goal: {timeToGoal} min</p>
			<p>Mean Velocity: {meanVelocity} km/h</p>
			<p>Goal velocity: {goalVelocity} km/h</p>
			<button
				className="text-start text-white p-2 mt-2 w-fit bg-red-600 rounded"
				onClick={() => deleteRun(run)}
			>
				Delete
			</button>
		</li>
	);
}
interface DSProps {
	runs: run[];
	deleteRun: DeleteRun;
}

function DataVisualizer({ runs, deleteRun }: DSProps) {
	const defaultGoalRun = { distance: 0, time: 0 };
	const [goalRunState, setGoalRunState] = useState(defaultGoalRun);

	useEffect(() => {
		const goal = getStoredGoalRun() ?? defaultGoalRun;
		setGoalRunState(goal);
	}, []);

	const runsAsListItems = runs.map((run) =>
		RunLi(run, deleteRun, goalRunState)
	);
	return (
		<ul className="flex flex-col gap-4 items-center pt-8 md:p-16">
			{runsAsListItems}
		</ul>
	);
}

export default function FormAndVisualizer() {
	const [runsState, setRunState] = useState<run[]>([]);

	function syncStateToLocalStorage() {
		setRunState(getRuns());
	}

	function addNewRun(run: run) {
		addRunToLocalStorage(run);
		syncStateToLocalStorage();
	}

	function deleteRun(run: run) {
		removeRunFromLocalStorage(run);
		syncStateToLocalStorage();
	}

	useEffect(syncStateToLocalStorage, []);

	return (
		<section className="min-h-screen font-mono " id="get-started">
			<h2 className="text-3xl py-14 text-center">
				Fill with your latest runs
			</h2>
			<Form addNewRun={addNewRun} />
			<DataVisualizer runs={runsState} deleteRun={deleteRun} />
			<Graph runs={runsState} />
		</section>
	);
}
