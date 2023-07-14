import {
	getRuns,
	addRunToLocalStorage,
	removeRunFromLocalStorage,
	type run,
	getGoalRun,
	NamelessRun,
} from "./localStorageManager";
import { useEffect, useState, useRef } from "react";
import { select, scaleBand, scaleLinear, ScaleBand, ScaleLinear } from "d3";
import { formatDateToString } from "./dateHelper";

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
	const [goalRun, setGoalRun] = useState(defaultGoalRun);

	useEffect(() => {
		const goal = getGoalRun() ?? defaultGoalRun;
		setGoalRun(goal);
	}, []);

	const runsAsListItems = runs.map((run) => RunLi(run, deleteRun, goalRun));
	return (
		<ul className="flex flex-col gap-4 items-center pt-8 md:p-16">
			{runsAsListItems}
		</ul>
	);
}

function calcSpeed({
	distance,
	time,
}: {
	distance: number;
	time: number;
}): number {
	const KMPerMin = distance / time;
	const minInAnHour = 60;
	const KMPerHour = KMPerMin * minInAnHour;

	return KMPerHour;
}

interface scale {
	xScale: ScaleBand<string>;
	ySpeedScale: ScaleLinear<number, number, never>;
	yDistanceScale: ScaleLinear<number, number, never>;
	yTimeScale: ScaleLinear<number, number, never>;
	maxHeight: number;
	maxWidth: number;
}
type SVGRef = React.RefObject<SVGSVGElement>;

function calcTopDomain(domain: number[]): number {
	const max = Math.max(...domain);
	const margin = Math.ceil(max / 10);

	return max + margin;
}

function getScales(runs: run[], svgRef: SVGRef): scale {
	const maxWidth = svgRef.current?.width.baseVal.value ?? 0;
	const maxHeight = svgRef.current?.height.baseVal.value ?? 0;

	const runSpeeds = runs.map(calcSpeed);
	const topSpeedDomain = calcTopDomain(runSpeeds);
	const ySpeedScale = scaleLinear()
		.domain([0, topSpeedDomain])
		.range([0, maxHeight]);

	const runDistances = runs.map((run) => run.distance);
	const topDistanceDomain = calcTopDomain(runDistances);
	const yDistanceScale = scaleLinear()
		.domain([0, topDistanceDomain])
		.range([0, maxHeight]);

	const runTimes = runs.map((run) => run.time);
	const topTimeDomain = calcTopDomain(runTimes);
	const yTimeScale = scaleLinear()
		.domain([0, topTimeDomain])
		.range([0, maxHeight]);

	const runNames = runs.map((run) => run.name);
	const xScale = scaleBand()
		.domain(["", ...runNames])
		.range([0, maxWidth]);

	return {
		xScale,
		ySpeedScale,
		yDistanceScale,
		yTimeScale,
		maxHeight,
		maxWidth,
	};
}

interface Point {
	x: number;
	y: number;
}

type Selector = "speed" | "distance" | "time";

function getLinePointsFor(run: run, scale: scale, selector: Selector): Point {
	const { xScale, ySpeedScale, yDistanceScale, yTimeScale, maxHeight } =
		scale;
	const point = { x: 0, y: 0 };

	const yValueFor = { speed: 0, distance: 0, time: 0 };

	const speed = calcSpeed(run);
	yValueFor.speed = ySpeedScale(speed);

	const { distance } = run;
	yValueFor.distance = yDistanceScale(distance);

	const { time } = run;
	yValueFor.time = yTimeScale(time);

	console.log(yValueFor);

	point.y = maxHeight - yValueFor[selector];

	const x = run.name;
	point.x = xScale(x) ?? 0;
	return point;
}
function formatLinePoints({ x, y }: Point): string {
	return `${x},${y} `;
}

function drawText(runs: run[], scale: scale, svgRef: SVGRef) {
	const { xScale } = scale;
	const svg = select(svgRef.current);
	const textOffset = 15;
	svg.selectAll("text")
		.data(runs)
		.enter()
		.append("text")
		.text((run) => run.name)
		.attr("y", textOffset)
		.attr("x", (run) => xScale(run.name) ?? 0);
}

function drawSVG(runs: run[], svgRef: SVGRef, selector: Selector) {
	const scale = getScales(runs, svgRef);
	drawText(runs, scale, svgRef);

	let linePoints = formatLinePoints({ x: 0, y: scale.maxHeight });

	runs.forEach((run) => {
		const point = getLinePointsFor(run, scale, selector);
		linePoints += formatLinePoints(point);
	});

	const polyline = select(svgRef.current).select("polyline");
	polyline.attr("points", linePoints);
}

function Graph({ runs }: { runs: run[] }) {
	const svgRef = useRef<SVGSVGElement>(null);
	const [selector, setSelector] = useState<Selector>("speed");
	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);
	function handleResize() {
		setWidth(window.innerWidth);
		setHeight(window.innerHeight);
	}

	useEffect(() => {
		handleResize();
		window.addEventListener("resize", handleResize);
	}, []);

	useEffect(
		() => drawSVG(runs, svgRef, selector),
		[runs, width, height, selector]
	);

	const ChangeButton = ({ value }: { value: Selector }) => {
		return (
			<button
				className="m-2 capitalize"
				onClick={() => setSelector(value)}
			>
				{value}
			</button>
		);
	};

	return (
		<div className="lg:h-[50vh] lg:w-[50vw] m-auto max-sm:m-4 border p-4 flex flex-col border-black">
			<h3>{selector} change over time</h3>
			<svg className="border flex-1 border-black" ref={svgRef}>
				<polyline stroke="#000" strokeWidth="2" fill="none" />
			</svg>
			<ChangeButton value="time" />
			<ChangeButton value="speed" />
			<ChangeButton value="distance" />
		</div>
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
