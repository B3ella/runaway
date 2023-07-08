import { useState } from "react";

export default function SetGoal() {
	const [distance, setDistance] = useState(0);
	const [time, setTime] = useState(0);

	return (
		<section className="h-screen">
			<h2 className="text-3xl p-16 font-mono text-center">
				set your goal run
			</h2>
			<form className="m-auto w-fit gap-4 flex flex-col">
				<label>
					Distance (Km)
					<input type="number" />
				</label>
				<label>
					Time (minutes)
					<input type="number" />
				</label>
			</form>
			<p className="m-auto w-fit p-16">
				Current goal: {"x"} Kms in {"y"} minutes
			</p>
		</section>
	);
}
