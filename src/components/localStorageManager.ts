const runTolken = "run";
const goalRunTolken = "goalRun";

interface run {
	name: string;
	distance: number;
	time: number;
}

interface NamelessRun {
	distance: number;
	time: number;
}

function getRuns(): run[] {
	const runs = localStorage.getItem(runTolken);
	return runs ? JSON.parse(runs) : [];
}

function setRuns(runs: run[]): run[] {
	const sRuns = JSON.stringify(runs);
	localStorage.setItem(runTolken, sRuns);
	return runs;
}

function addRun(run: run): run[] {
	const currRuns = getRuns();

	const newRuns = [...currRuns, run];
	return setRuns(newRuns);
}

function areTheSameRun(run1: run, run2: run): boolean {
	const sameDistance = run1.distance === run2.distance;
	const sametime = run1.time === run2.time;
	const sameName = run1.name === run2.name;
	const sameRun = sameDistance && sametime && sameName;
	return sameRun;
}

function findRunIndex(targetRun: run): number {
	const currRuns = getRuns();
	return currRuns.findIndex((run) => areTheSameRun(run, targetRun));
}

function removeRun(targetRun: run): run[] {
	const currRuns = getRuns();
	const index = findRunIndex(targetRun);

	const runDoesNotExist = index < 0;
	const isLastRun = index === 0;

	if (runDoesNotExist) return currRuns;
	if (isLastRun) return setRuns([]);

	const newRuns = currRuns.splice(index, 1);
	return setRuns(newRuns);
}

function getGoalRun(): NamelessRun | null {
	const res = localStorage.getItem(goalRunTolken);
	return res ? JSON.parse(res) : null;
}

function setGoalRun(run: NamelessRun): void {
	const StringRun = JSON.stringify(run);
	localStorage.setItem(goalRunTolken, StringRun);
}

export { getRuns, addRun, removeRun, getGoalRun, setGoalRun, type run };
