type CsvData = Array<Record<string, string>>;
type CsvChunk = Record<string, string>[];
type CsvChunks = Record<string, CsvChunk>;

interface MessageData {
	searchVal: string;
	csvData: CsvData;
	csvChunks: CsvChunks;
	timestamp: number;
	matches?: CsvData;
}

const getIdealChunkSize = (length: number) => {
	if (length > 10) {
		return Math.floor(length / 10);
	} else {
		return Math.floor(length / 4);
	}
};

const createRowChunks = (
	csvRows: Record<string, string>[],
	chunkSize: number = 90
): CsvChunks => {
	const chunks = {} as Record<string, Record<string, string>[]>;

	let chunkIdx = 0;
	for (let i = 0; i < csvRows.length; i += chunkSize) {
		const chunk = csvRows.slice(i, i + chunkSize);
		chunks[chunkIdx] = chunk;
		chunkIdx++;
	}

	return chunks;
};

const searchChunk = (searchVal: string, chunkOfData: CsvChunk): CsvChunk => {
	const keys = Object.keys(chunkOfData[0]);
	const value = searchVal.toLowerCase();

	return chunkOfData.filter((item) => {
		return keys.some((key) => {
			const val = item[key].toLowerCase();
			return val?.includes(value) || val?.startsWith(value);
		});
	});
};

const searchChunkAsync = (
	searchVal: string,
	chunkOfData: CsvChunk
): Promise<CsvChunk> => {
	return new Promise((resolve) => {
		return resolve(searchChunk(searchVal, chunkOfData));
	});
};

const searchChunksInParallel = async (searchVal: string, chunks: CsvChunks) => {
	const chunkKeys = Object.keys(chunks);
	const promises = chunkKeys.map((chunkKey) => {
		const chunk = chunks[chunkKey];
		return searchChunkAsync(searchVal, chunk);
	});

	const allResults = await Promise.all(promises);

	return allResults.flat(Infinity);
};

self.onmessage = async (msg: MessageEvent<MessageData>) => {
	const { searchVal, csvData, timestamp } = msg.data as MessageData;

	self.postMessage({
		Received: csvData.length,
		SearchVal: searchVal,
	});
	const chunkSize = getIdealChunkSize(csvData.length);
	const csvChunks = createRowChunks(csvData, chunkSize);
	const matches = await searchChunksInParallel(searchVal, csvChunks);

	if (matches) {
		const end = performance.now();
		self.postMessage({
			Matches: matches,
			Results: matches.length || 0,
			Message: `Searching has completed!`,
			Timestamps: {
				start: timestamp,
				end: end,
				elapsed: end - timestamp,
			},
		});
	}
};
