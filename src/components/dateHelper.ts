function pad(string: string, char: string, length: number): string {
	while (string.length < length) {
		string = char + string;
	}
	return string;
}

function formatDateToString(date: Date) {
	date = new Date(date);
	let year = date.getFullYear().toString();
	year = pad(year, "0", 4);

	let month = date.getMonth().toString();
	month = pad(month, "0", 2);

	let day = date.getDate().toString();
	day = pad(day, "0", 2);

	return `${year}-${month}-${day}`;
}

export { formatDateToString };
