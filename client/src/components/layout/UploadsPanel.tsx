import { ReactNode } from "react";
import styles from "../../css/layout/UploadsPanel.module.scss";
import { FileItem } from "../uploads/types";
import UploadActions from "./UploadActions";
import { bytesTo, calculateTotalSize } from "../../utils/utils_files";
import ActionButton from "./ActionButton";

type HeaderProps = {
	isLoading: boolean;
	filesList: FileItem[];
	uploadFiles: () => void;
};

const PanelHeader = ({ filesList, uploadFiles, isLoading }: HeaderProps) => {
	const rawTotal: number = calculateTotalSize(
		filesList.map((item) => item.file)
	);
	const totalSizeInKb: number = bytesTo(rawTotal, "KB");

	return (
		<header className={styles.PanelHeader}>
			<h1 className={styles.PanelHeader_title}>
				Recent Uploads <b>({filesList.length ?? ""})</b>
			</h1>
			<div className={styles.PanelHeader_right}>
				<p
					className={styles.PanelHeader_total}
					title={bytesTo(rawTotal, "MB").toFixed(2) + " MB"}
				>
					Total: {totalSizeInKb.toFixed(2)} KB
				</p>
				<button
					type="button"
					onClick={uploadFiles}
					disabled={!filesList.length || isLoading}
					className={styles.PanelHeader_right_uploadBtn}
				>
					{isLoading ? "Loading..." : "Upload"}
				</button>
			</div>
		</header>
	);
};

type Props = {
	isLoading: boolean;
	filesList: FileItem[];
	isAllSelected: boolean;
	removeFiles: () => void;
	selectAllFiles: () => void;
	zipSelectedFiles: () => void;
	uploadSelectedFiles: () => void;
	selectMoreOptions: () => void;
	children?: ReactNode;
};

const UploadsPanel = ({
	filesList,
	selectMoreOptions,
	zipSelectedFiles,
	uploadSelectedFiles,
	selectAllFiles,
	removeFiles,
	isLoading = false,
	isAllSelected = false,
	children,
}: Props) => {
	return (
		<div className={styles.UploadsPanel}>
			<div className={styles.UploadsPanel_header}>
				<PanelHeader
					isLoading={isLoading}
					filesList={filesList}
					uploadFiles={uploadSelectedFiles}
				/>
			</div>
			<div className={styles.UploadsPanel_top}>
				<UploadActions isAllSelected={isAllSelected} selectAll={selectAllFiles}>
					<ActionButton
						title="Zip Files"
						icon="zip"
						onClick={zipSelectedFiles}
					/>
					<ActionButton
						title="Upload Files"
						icon="upload"
						onClick={uploadSelectedFiles}
					/>
					<ActionButton title="Delete" icon="delete" onClick={removeFiles} />
					<ActionButton
						title="Options"
						icon="more"
						onClick={selectMoreOptions}
					/>
				</UploadActions>
			</div>
			<div className={styles.UploadsPanel_inner}>{children}</div>
		</div>
	);
};

export default UploadsPanel;
