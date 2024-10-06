import { ChangeEvent } from "react";
import styles from "../../css/files/FilesTableHeader.module.scss";
import TextInput from "../shared/TextInput";

type Props = {
	searchVal: string;
	filesCount: number;
	handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
};

const FilesTableHeader = ({
	searchVal,
	handleSearch,
	filesCount = 0,
}: Props) => {
	return (
		<header className={styles.FilesTableHeader}>
			<div className={styles.FilesTableHeader_header}>
				All Files ({filesCount})
			</div>
			<div className={styles.FilesTableHeader_main}>
				<div className={styles.FilesTableHeader_main_filters}>
					{/* TBD */}
					{/* TBD */}
				</div>
				<div className={styles.FilesTableHeader_main_search}>
					<TextInput
						value={searchVal}
						placeholder="Search..."
						onChange={handleSearch}
					/>
				</div>
			</div>
		</header>
	);
};

export default FilesTableHeader;
