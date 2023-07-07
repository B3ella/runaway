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

function removeRun(run: run): run[] {
	const currRuns = getRuns();

	const index = currRuns.indexOf(run);

    if(index<0) return currRuns
        
	const newRuns = currRuns.splice(index, 1);

	setRuns(newRuns);
	return newRuns;
}

export { getRuns, setRuns, addRun, removeRun, type run };
