import React from "react";
import sprite from "../../assets/icons/converter.svg";
import styles from "../../css/files/FileActionsIsland.module.scss";
import { SmartTotals } from "../../utils/utils_files";

type SelectedProps = {
	selectedCount: number;
	totalCount: number;
};

const Selected = ({ selectedCount, totalCount }: SelectedProps) => {
	return (
		<div className={styles.Selected}>
			<span className={styles.Selected_count}>{selectedCount}</span>/
			<span className={styles.Selected_label}>{totalCount}</span>
		</div>
	);
};

type ArchiverProps = {
	onClick: () => void;
};
const Archiver = ({ onClick }: ArchiverProps) => {
	return (
		<div title="Zip Files" onClick={onClick} className={styles.Archiver}>
			<svg className={styles.Archiver_icon}>
				<use xlinkHref={`${sprite}#icon-file-archive-o`}></use>
			</svg>
		</div>
	);
};
type DeleteProps = {
	onClick: () => void;
};
const Delete = ({ onClick }: DeleteProps) => {
	return (
		<div title="Delete Files" onClick={onClick} className={styles.Delete}>
			<svg className={styles.Delete_icon}>
				<use xlinkHref={`${sprite}#icon-delete`}></use>
			</svg>
		</div>
	);
};

type ConvertProps = {
	onClick: () => void;
};
const Converter = ({ onClick }: ConvertProps) => {
	return (
		<div title="Convert Files" onClick={onClick} className={styles.Converter}>
			<svg className={styles.Converter_icon}>
				<use xlinkHref={`${sprite}#icon-burst_mode`}></use>
			</svg>
		</div>
	);
};

const Splitter = () => {
	return <div className={styles.Splitter}></div>;
};

type Props = {
	allFiles: File[];
	selectedFiles: File[];
	smartSizeTotals: SmartTotals;
	convertSelectedFiles: () => void;
	archiveSelectedFiles: () => void;
	deleteSelectedFiles: () => void;
};

const FileActionsIsland = ({
	allFiles,
	selectedFiles,
	smartSizeTotals,
	convertSelectedFiles,
	archiveSelectedFiles,
	deleteSelectedFiles,
}: Props) => {
	const totalCount: number = allFiles?.length ?? 0;
	const selectedCount: number = selectedFiles?.length ?? 0;
	const hoverTitle: string = `${smartSizeTotals.selected} / ${smartSizeTotals.files}`;
	return (
		<aside data-active={false} className={styles.FileActionsIsland}>
			<div className={styles.FileActionsIsland_inner} title={hoverTitle}>
				<Selected selectedCount={selectedCount} totalCount={totalCount} />
				<Splitter />
				<Archiver onClick={archiveSelectedFiles} />
				<Splitter />
				<Converter onClick={convertSelectedFiles} />
				<Splitter />
				<Delete onClick={deleteSelectedFiles} />
			</div>
		</aside>
	);
};

export default FileActionsIsland;
