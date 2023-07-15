export default function calcSpeed({
	distance,
	time,
}: {
	distance: number;
	time: number;
}): number {
	const km = distance;
	const minutes = time;

	const minutesInAnHour = 60;
	const hours = minutes / minutesInAnHour;

	const KMPerHour = km / hours;

	return KMPerHour;
}
