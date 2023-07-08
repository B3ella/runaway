import { useEffect, useState } from "react";
import { getGoalRun, setGoalRun } from "./localStorageManager";

export default function SetGoal() {
	const [distance, setDistance] = useState(0);
	const [time, setTime] = useState(0);

	const defaultRunState = { time: 0, distance: 0 };
	const [goalState, setGoalState] = useState(defaultRunState);

	useEffect(() => {
		setGoalState(getGoalRun() ?? defaultRunState);
	}, []);

	type changeEvent = React.ChangeEvent<HTMLInputElement>;
	const changeDistance = (e: changeEvent) => setDistance(+e.target.value);
	const changeTime = (e: changeEvent) => setTime(+e.target.value);

	function resetValues() {
		setDistance(0);
		setTime(0);
	}

	function setGoal(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		event.preventDefault();

		const run = { distance, time };

		setGoalRun(run);
		setGoalState(run);

		resetValues();
	}

	return (
		<section className="h-screen">
			<h2 className="text-3xl p-16 font-mono text-center">
				set your goal run
			</h2>
			<form className="m-auto w-fit gap-4 flex flex-col">
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
				<button onClick={setGoal}>set goal run</button>
			</form>
			<p className="m-auto w-fit p-16">
				Current goal: {goalState.distance} Kms in {goalState.time}{" "}
				minutes
			</p>
		</section>
	);
}
