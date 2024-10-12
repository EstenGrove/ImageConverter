// Processes CSV data into an array of objects w/ each row's values mapped by header as a key
const processCsvToObjects = (csv: string): Record<string, string>[] => {
	const lines: string[] = csv.split("\n");
	const headers: string[] = lines?.[0].split(",");

	const results: Record<string, string>[] = [];

	for (let i = 0; i < lines.length; i++) {
		const curLine: string[] = lines[i].split(",");

		if (curLine.length === headers.length) {
			const lineData = {} as Record<string, string>;

			// get each column for each header & set a key/val pair: [header]: value
			for (let j = 0; j < headers.length; j++) {
				const headerCol: string = headers[j];

				lineData[headerCol] = curLine[j];
			}
			results.push(lineData);
		}
	}

	return results;
};

export { processCsvToObjects };
