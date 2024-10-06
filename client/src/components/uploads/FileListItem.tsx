import React from "react";
import sprite from "../../assets/icons/converter.svg";
import styles from "../../css/uploads/FileListItem.module.scss";
import { bytesTo } from "../../utils/utils_files";
import { FileItem } from "./types";
import FileItemPreview from "./FileItemPreview";
import { addEllipsis } from "../../utils/utils_misc";

type Props = {
	fileItem: FileItem;
	selectFile: () => void;
	isSelected: boolean;
};

type SelectProps = {
	isSelected: boolean;
	selectItem: () => void;
};

const marked = "check_box";
const unmarked = "check_box_outline_blank";

const SelectItem = ({ isSelected = false, selectItem }: SelectProps) => {
	return (
		<button type="button" onClick={selectItem} className={styles.SelectItem}>
			<svg className={styles.SelectItem_icon}>
				<use
					xlinkHref={`${sprite}#icon-${isSelected ? marked : unmarked}`}
				></use>
			</svg>
		</button>
	);
};

const FileListItem = ({ fileItem, selectFile, isSelected = false }: Props) => {
	const { file } = fileItem;
	const name: string = addEllipsis(file.name, 30);
	const sizeInKb: number = bytesTo(file.size, "KB");

	return (
		<li className={styles.FileListItem} data-selected={isSelected.toString()}>
			<div className={styles.FileListItem_selector}>
				<SelectItem isSelected={isSelected} selectItem={selectFile} />
			</div>
			<div className={styles.FileListItem_preview}>
				<FileItemPreview fileItem={fileItem} />
			</div>
			<div className={styles.FileListItem_name} title={file.name}>
				<div className={styles.FileListItem_name_text}>{name}</div>
			</div>
			<div className={styles.FileListItem_size}>{sizeInKb.toFixed(2)} KB</div>
			{/* DELETE BUTTON */}
		</li>
	);
};

export default FileListItem;
