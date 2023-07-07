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

function addRun(run: run): run[] {
	const currRuns = getRuns();

	const newRuns = [...currRuns, run];
	setRuns(newRuns);
	return newRuns;
}

function removeRun(targetRun: run): run[] {
	const currRuns = getRuns();

	const index = currRuns.findIndex((run) => {
		const sameDistance = run.distance === targetRun.distance;
		const sametime = run.time === targetRun.time;
		const sameName = run.name === targetRun.name;
		const sameRun = sameDistance && sametime && sameName;
		return sameRun;
	});

	const runDoesNotExist = index < 0;

	if (runDoesNotExist) return currRuns;

	const shouldDeleteAllRuns = index === 0;
	if (shouldDeleteAllRuns) {
		setRuns([]);
		return [];
	}

	const newRuns = currRuns.splice(index, 1);

	setRuns(newRuns);
	return newRuns;
}

export { getRuns, addRun, removeRun, type run };
