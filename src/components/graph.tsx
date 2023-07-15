import type { run } from "./localStorageManager";
import { useEffect, useState, useRef } from "react";
import { select, scaleBand, scaleLinear, ScaleBand, ScaleLinear } from "d3";
import calcSpeed from "./calcSpeed";

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

function getYFor(selector: Selector, run: run, scale: scale): number {
	const yValueFor = { speed: 0, distance: 0, time: 0 };

	const speed = calcSpeed(run);
	yValueFor.speed = scale.ySpeedScale(speed);

	const { distance } = run;
	yValueFor.distance = scale.yDistanceScale(distance);

	const { time } = run;
	yValueFor.time = scale.yTimeScale(time);
	return scale.maxHeight - yValueFor[selector];
}

function getLinePointsFor(run: run, scale: scale, selector: Selector): Point {
	const { xScale } = scale;
	const point = { x: 0, y: 0 };

	point.y = getYFor(selector, run, scale);
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
export default function Graph({ runs }: { runs: run[] }) {
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
