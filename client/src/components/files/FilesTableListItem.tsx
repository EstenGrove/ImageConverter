import { MouseEvent, useRef, useState } from "react";
import sprite from "../../assets/icons/converter.svg";
import styles from "../../css/files/FilesTableListItem.module.scss";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { WindowSize } from "../../hooks/useWindowSize";
import { useDelayedHover } from "../../hooks/useDelayedHover";
import { getSmartFileSize, saveFile } from "../../utils/utils_files";
import { createImgSrc } from "../../utils/utils_misc";
import HoverPreview from "./HoverPreview";

type Props = {
	file: File;
	isSelected: boolean;
	selectFile: () => void;
	removeFile: () => void;
	shiftSelectFile: () => void;
	selectOption?: (option: string) => void;
	windowSize: WindowSize;
};

type SelectProps = {
	isSelected: boolean;
	selectItem: () => void;
	shiftSelectItem: () => void;
};

const marked = "check_box";
const unmarked = "check_box_outline_blank";

const SelectItem = ({
	isSelected = false,
	selectItem,
	shiftSelectItem,
}: SelectProps) => {
	const selectionHandler = (e: MouseEvent) => {
		if (e.shiftKey && !isSelected) {
			return shiftSelectItem();
		} else {
			return selectItem();
		}
	};

	return (
		<button
			type="button"
			onClick={selectionHandler}
			className={styles.SelectItem}
		>
			<svg className={styles.SelectItem_icon}>
				<use
					xlinkHref={`${sprite}#icon-${isSelected ? marked : unmarked}`}
				></use>
			</svg>
		</button>
	);
};

const getAbbrevFileType = (file: File): string => {
	const rawType: string = file.type;
	const split = rawType.split("/")[1];
	return "." + split;
};

const getFileName = (name: string, maxLength: number = 30): string => {
	if (name.length <= maxLength) return name;

	const sliced: string = name.slice(0, maxLength - 3);
	return sliced + "...";
};

type ActionsProps = {
	openFileActions: () => void;
};
const FileActions = ({ openFileActions }: ActionsProps) => {
	return (
		<div className={styles.FileActions}>
			<button
				type="button"
				onClick={openFileActions}
				className={styles.FileActions_button}
			>
				<svg className={styles.FileActions_button_icon}>
					<use xlinkHref={`${sprite}#icon-more_vert`}></use>
				</svg>
			</button>
		</div>
	);
};

type ActionsMenuProps = {
	closeMenu: () => void;
	selectAction: (action: string) => void;
};

const FileActionsMenu = ({ selectAction, closeMenu }: ActionsMenuProps) => {
	const menuRef = useRef<HTMLDivElement>(null);
	useOutsideClick(menuRef, () => {
		closeMenu();
	});
	return (
		<div ref={menuRef} className={styles.FileActionsMenu}>
			<div className={styles.FileActionsMenu_top}>
				<div>Actions</div>
			</div>
			<ul className={styles.FileActionsMenu_list}>
				<li
					onClick={() => selectAction("View")}
					className={styles.FileActionsMenu_list_item}
				>
					<span>View Preview</span>
					<svg className={styles.FileActionsMenu_list_item_icon}>
						<use xlinkHref={`${sprite}#icon-image`}></use>
					</svg>
				</li>
				<li
					onClick={() => selectAction("Download")}
					className={styles.FileActionsMenu_list_item}
				>
					<span>Download</span>
					<svg className={styles.FileActionsMenu_list_item_downloadIcon}>
						<use xlinkHref={`${sprite}#icon-file_download`}></use>
					</svg>
				</li>
				<li
					onClick={() => selectAction("Delete")}
					className={styles.FileActionsMenu_list_item}
					style={{ marginTop: "2.7rem", color: "red" }}
				>
					<span>Delete</span>
					<svg className={styles.FileActionsMenu_list_item_deleteIcon}>
						<use xlinkHref={`${sprite}#icon-delete`}></use>
					</svg>
				</li>
			</ul>
		</div>
	);
};

const FilesTableListItem = ({
	file,
	selectFile,
	removeFile,
	shiftSelectFile,
	windowSize,
	isSelected = false,
}: Props) => {
	const { width } = windowSize;
	const hoverSrc = useRef<string>(""); // hover preview img.src
	const nameSize: number = width <= 800 ? 20 : 35;
	const fileName: string = getFileName(file.name, nameSize);
	const fileType: string = getAbbrevFileType(file);
	const smartFileSize: string = getSmartFileSize(file.size);
	const [showActionsMenu, setShowActionsMenu] = useState(false);
	const [showHoverPreview, setShowHoverPreview] = useState(false);
	const { startTimer, stopTimer } = useDelayedHover(550, {
		onHover() {
			showPreview();
		},
		onExit() {
			hidePreview();
		},
	});

	const openFileActions = () => {
		setShowActionsMenu(true);
	};
	const closeFileActions = () => {
		setShowActionsMenu(false);
	};

	const selectFileAction = (type: string) => {
		switch (type) {
			case "View": {
				// open a preview
				return;
			}
			case "Delete": {
				// delete fileupload
				return removeFile();
			}
			case "Download": {
				// download file
				return saveFile(file, file.name);
			}

			default:
				break;
		}
	};

	const showPreview = () => {
		hoverSrc.current = createImgSrc(file);
		setShowHoverPreview(true);
	};
	const hidePreview = () => {
		setShowHoverPreview(false);
		URL.revokeObjectURL(hoverSrc.current);
		hoverSrc.current = "";
	};

	return (
		<div
			className={styles.FilesTableListItem}
			data-selected={isSelected.toString()}
		>
			<div className={styles.FilesTableListItem_name}>
				<SelectItem
					isSelected={isSelected}
					selectItem={selectFile}
					shiftSelectItem={shiftSelectFile}
				/>
				<div
					style={{ marginLeft: ".5rem" }}
					onMouseEnter={startTimer}
					onMouseOut={stopTimer}
				>
					{fileName}
				</div>

				{showHoverPreview && (
					<HoverPreview hoverSrc={hoverSrc.current} alt={file.name} />
				)}
			</div>
			<div className={styles.FilesTableListItem_type}>
				<div>{fileType}</div>
			</div>
			<div className={styles.FilesTableListItem_size}>
				<div>{smartFileSize}</div>
			</div>
			<div className={styles.FilesTableListItem_actions}>
				<FileActions openFileActions={openFileActions} />
				{showActionsMenu && (
					<FileActionsMenu
						selectAction={selectFileAction}
						closeMenu={closeFileActions}
					/>
				)}
			</div>
		</div>
	);
};

export default FilesTableListItem;
