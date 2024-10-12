import { CSSProperties } from "react";
import styles from "../../css/csv-viewer/CsvTableRow.module.scss";
import { addEllipsis } from "../../utils/utils_misc";

type Props = {
	row: Record<string, string>;
	idx: number;
	style: CSSProperties;
};

type CellProps = {
	value: string;
};
const Cell = ({ value }: CellProps) => {
	const val: string = addEllipsis(value, 15);
	return (
		<div className={styles.Cell}>
			<div>{val}</div>
		</div>
	);
};

const CsvTableRow = ({ idx, row, style }: Props) => {
	const colKeys: string[] = Object.keys(row);
	return (
		<div className={styles.CsvTableRow} style={style}>
			<div className={styles.CsvTableRow_inner}>
				<Cell value={idx.toString()} />
				{colKeys &&
					colKeys.map((key, idx) => <Cell key={key + idx} value={row[key]} />)}
			</div>
		</div>
	);
};

export default CsvTableRow;
