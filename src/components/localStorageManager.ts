const runTolken = "run";

interface run {
	name: string;
	distance: number;
	time: number;
}

function getRuns(): run[] {
	const runs = localStorage.getItem(runTolken) ?? "[]";
	return JSON.parse(runs);
}

function setRuns(runs: run[]): void {
	const sRuns = JSON.stringify(runs);
	localStorage.setItem(runTolken, sRuns);
}

function addRun(run: run) {
	const currRuns = getRuns();

	const newRuns = [...currRuns, run];
	setRuns(newRuns);
	return newRuns;
}

export { getRuns, setRuns, addRun, type run };
