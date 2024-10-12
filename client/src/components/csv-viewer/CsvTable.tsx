import { RefObject, CSSProperties } from "react";
import { FixedSizeList as List } from "react-window";
import styles from "../../css/csv-viewer/CsvTable.module.scss";
import CsvTableRow from "./CsvTableRow";

type Props = {
	csvFile: File;
	csvData: Record<string, string>[];
	tableRef: RefObject<HTMLDivElement>;
};

type RowProps = {
	index: number;
	style: CSSProperties;
};

const CsvTable = ({ csvData, csvFile }: Props) => {
	const resultSet = csvData.length.toLocaleString();

	const Row = ({ index, style }: RowProps) => (
		<CsvTableRow row={csvData[index]} idx={index} style={style} />
	);

	return (
		<section className={styles.CsvTable}>
			<div className={styles.CsvTable_top}>
				<h2>
					File: <b>{csvFile.name || ""}</b>
				</h2>
				<i>{resultSet || 0} results</i>
			</div>
			<List
				className={styles.CsvTable_rows}
				width="100%"
				height={420}
				itemSize={40}
				itemData={csvData}
				itemCount={csvData.length}
			>
				{Row}
			</List>
		</section>
	);
};

export default CsvTable;
