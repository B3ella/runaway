import { getRuns, run } from "./localStorageManager";

function RunLi({ name, distance, time }: run) {
	const meanVelocity = (distance / time) * 60;

	return (
		<li className="flex justify-between w-1/3">
			<h3>{name}</h3>
			<p>distance: {distance} km</p>
			<p>time: {time} min</p>
			<p>Mean Velocity: {meanVelocity} km/h</p>
		</li>
	);
}

export default function DataVisualizer() {
	const runs = getRuns();

	const runComp = runs.map(RunLi);

	return <ul className="flex flex-col items-center p-16">{runComp}</ul>;
}
