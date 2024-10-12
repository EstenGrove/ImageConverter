import styles from "../css/pages/CsvViewerPage.module.scss";
import {
	ChangeEvent,
	useRef,
	useState,
	useEffect,
	useCallback,
	useMemo,
} from "react";
import { readFileAsText } from "../utils/utils_files";
import { processCsvToObjects } from "../utils/utils_csv";
import { useWebWorker } from "../hooks/useWebWorker";
import FileDropZone from "../components/shared/FileDropZone";
import CsvTable from "../components/csv-viewer/CsvTable";
import TextInput from "../components/shared/TextInput";

// Data response from worker
interface WorkerResponse {
	Matches: CsvData;
	Results: number;
	Message: string;
	Timestamps: {
		start: number | null;
		end: number | null;
		elapsed: number | null;
	};
}

type CsvData = Record<string, string>[];
type CsvChunks = Record<string, Record<string, string>[]>;

const workerPath = "search.worker.ts";

const basePath = new URL("../workers", import.meta.url).toString();
const workerFile = basePath + "/" + workerPath;

const CsvViewerPage = () => {
	const innerRef = useRef<HTMLDivElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [csvData, setCsvData] = useState<CsvData>([]); // entire file as csv-to-objects
	const [searchVal, setSearchVal] = useState("");
	const [filteredData, setFilteredData] = useState<CsvData>([]);
	const isSearching = useMemo(() => {
		return searchVal && searchVal !== "";
	}, [searchVal]);
	const worker = useWebWorker(workerFile, {
		onMessage(msg: MessageEvent) {
			const { Matches } = msg.data as WorkerResponse;
			setFilteredData(Matches);
		},
	});

	const onFile = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		const newFile = files?.[0] as File;

		setFile(newFile);
		readCsv(newFile);
	};

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSearchVal(value);
	};

	const readCsv = async (file: File) => {
		const data = await readFileAsText(file);
		const csvRows: CsvData = processCsvToObjects(data);

		setCsvData(csvRows);
		setFilteredData([]);
	};

	const searchCsv = useCallback(() => {
		if (worker.worker) {
			worker.sendMessage({
				searchVal,
				csvData,
				timestamp: performance.now(),
			});
		}
	}, [csvData, worker, searchVal]);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}

		let searchID: ReturnType<typeof setTimeout>;

		if (isSearching) {
			searchID = setTimeout(() => {
				searchCsv();
			}, 750);
		}

		return () => {
			isMounted = false;
			clearTimeout(searchID);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchVal, isSearching]);

	return (
		<div className={styles.CsvViewerPage}>
			<div className={styles.CsvViewerPage_dropzone}>
				<FileDropZone
					name="csvFile"
					accept="text/csv"
					hasFile={!!file}
					onFile={onFile}
				/>
			</div>
			<div className={styles.CsvViewerPage_search}>
				<label htmlFor="search">Search Csv:</label>
				<TextInput
					value={searchVal}
					onChange={onChange}
					placeholder="Search data..."
				/>
			</div>
			<div className={styles.CsvViewerPage_outer}>
				{/* Searching data */}
				{filteredData?.length > 0 && isSearching && (
					<CsvTable
						tableRef={innerRef}
						csvFile={file as File}
						csvData={filteredData}
					/>
				)}
				{/* Table data */}
				{csvData?.length > 0 && !isSearching && (
					<CsvTable
						tableRef={innerRef}
						csvFile={file as File}
						csvData={csvData}
					/>
				)}
			</div>
		</div>
	);
};

export default CsvViewerPage;
