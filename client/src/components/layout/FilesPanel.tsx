import {
	useState,
	ChangeEvent,
	ComponentPropsWithoutRef,
	RefObject,
	useRef,
} from "react";
import { archiveFiles } from "../../utils/utils_uploads";
import { getSmartSizeTotals, saveFile } from "../../utils/utils_files";
import sprite from "../../assets/icons/converter.svg";
import styles from "../../css/layout/FilesPanel.module.scss";
import Modal from "../shared/Modal";
import Processing from "../files/Processing";
import FilesTable from "../files/FilesTable";
import ControlsPanel from "../controls/ControlsPanel";
import FileActionsIsland from "../files/FileActionsIsland";

interface UploadProps {
	inputRef?: RefObject<HTMLInputElement>;
	onFile: (e: ChangeEvent<HTMLInputElement>) => void;
}

interface InputProps extends UploadProps, ComponentPropsWithoutRef<"input"> {}

const UploadButton = ({ inputRef, onFile, ...rest }: InputProps) => {
	return (
		<label htmlFor="uploads" className={styles.UploadButton}>
			<input
				ref={inputRef}
				type="file"
				name="uploads"
				id="uploads"
				onChange={onFile}
				className={styles.UploadButton_input}
				{...rest}
			/>
			<svg className={styles.UploadButton_icon}>
				<use xlinkHref={`${sprite}#icon-add`}></use>
			</svg>
			<span>Upload</span>
		</label>
	);
};

interface FileSettings {
	quality: string;
	format: "webp" | "avif" | "jpeg" | "png" | "jpg";
	width: number;
	height: number;
}

const getFileIndex = (file: File, list: File[]): number => {
	return list.findIndex((item) => {
		return item.name === file.name;
	});
};

interface Selected {
	lastIdx: number;
	newIdx: number;
}
const getSelectedSubarray = (
	filesList: File[],
	positions: Selected
): File[] => {
	const { lastIdx, newIdx } = positions;

	// if no existing selections, then single select the file
	if (lastIdx < 0) return filesList.slice(newIdx, newIdx);

	if (newIdx < lastIdx) {
		const subarray: File[] = filesList.slice(newIdx, lastIdx);
		return subarray;
	} else {
		const subarray: File[] = filesList.slice(lastIdx, newIdx + 1);
		return subarray;
	}
};

const FilesPanel = () => {
	const abortController = useRef<AbortController>();
	const [isLoading, setIsLoading] = useState(false);
	const [showControls, setShowControls] = useState(false);
	const [filesList, setFilesList] = useState<File[]>([]);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const lastSelectedIdx = useRef<number>(-1);
	// total file sizes
	const sizeTotals = getSmartSizeTotals(filesList, selectedFiles);
	const hasFiles: boolean = filesList && filesList.length > 0;
	const isAllSelected: boolean = selectedFiles?.length === filesList?.length;

	// convert settings
	const [fileSettings, setFileSettings] = useState<FileSettings>({
		quality: "90%",
		format: "webp",
		width: 0,
		height: 0,
	});

	const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const evtFiles = e.target.files as FileList;
		const files = Array.from(evtFiles);

		setFilesList([...files, ...filesList]);
	};
	const handleFilesDrop = (files: File[]) => {
		const newFilesList = [...files, ...filesList];

		setFilesList(newFilesList);
	};

	const selectAll = () => {
		if (isAllSelected) {
			setSelectedFiles([]);
		} else {
			setSelectedFiles(filesList);
		}
	};

	const selectFile = (file: File) => {
		const fileIdx: number = getFileIndex(file, selectedFiles);
		const selectedIdx: number = getFileIndex(file, filesList);

		// if file is already selected, remove it
		if (fileIdx > -1) {
			const updated = [
				...selectedFiles.filter((cur) => cur.name !== file.name),
			];
			setSelectedFiles(updated);
			lastSelectedIdx.current = -1;
		} else {
			const updated = [...selectedFiles, file];

			setSelectedFiles(updated);
			lastSelectedIdx.current = selectedIdx;
		}
	};

	const shiftSelectFiles = (file: File) => {
		// idx of our file within the total files list
		const newIdx: number = getFileIndex(file, filesList);
		const lastSelected: number = lastSelectedIdx.current;
		// idx of our newFile within the selections list
		const newSelectIdx: number = getFileIndex(file, selectedFiles);

		// ##TODOS:
		// - Investigate if this is the best approach or not???
		// if file is already selected, we fallback to single select handling
		if (newSelectIdx > 0) {
			return selectFile(file);
		} else {
			// select all files between lastIdx & and new selection
			const filesToSelect: File[] = getSelectedSubarray(filesList, {
				lastIdx: lastSelected,
				newIdx: newIdx,
			});

			setSelectedFiles([...selectedFiles, ...filesToSelect]);
			lastSelectedIdx.current = newIdx;
		}
	};

	const removeFile = (file: File) => {
		const newFilesList: File[] = filesList.filter(
			(item) => item.name !== file.name
		);

		setFilesList(newFilesList);
	};

	const deleteSelectedFiles = () => {
		if (!selectedFiles.length) {
			alert("No selected files!");
			return;
		}
		const selectedNames = selectedFiles.map(({ name }) => name);
		const newFilesList = filesList.filter((item) => {
			return !selectedNames.includes(item.name);
		});

		setFilesList(newFilesList);
		setSelectedFiles([]);
	};

	const archiveSelectedFiles = async () => {
		if (!selectedFiles.length) {
			alert("No files selected!");
			setIsLoading(false);
			return;
		}
		const files: File[] = selectedFiles;
		const controller = new AbortController();
		abortController.current = controller;
		const signal = controller.signal;
		const resp = (await archiveFiles(files, signal)) as Response;

		if (resp) {
			const blob = await resp.blob();
			saveFile(blob, "Archive.zip");
			setIsLoading(false);
		}
	};

	const convertSelectedFiles = async () => {
		// do stuff
	};

	const handleControl = (name: string, value: string | number) => {
		console.log("name", name);
		console.log("value", value);
		setFileSettings({
			...fileSettings,
			[name]: value,
		});
	};

	const openControlsModal = () => {
		setShowControls(true);
	};
	const closeControlsModal = () => {
		setShowControls(false);
	};

	const cancelAction = () => {
		if (abortController.current) {
			const controller = abortController.current as AbortController;
			controller.abort();
		}
		setIsLoading(false);
	};

	return (
		<section className={styles.FilesPanel}>
			<div className={styles.FilesPanel_top}>
				<UploadButton onFile={handleFileUpload} multiple={true} />
			</div>
			<div className={styles.FilesPanel_table}>
				<FilesTable
					onFiles={handleFilesDrop}
					selectAll={selectAll}
					selectFile={selectFile}
					removeFile={removeFile}
					filesList={filesList}
					selectedFiles={selectedFiles}
					shiftSelectFile={shiftSelectFiles}
					isAllSelected={isAllSelected}
				/>
			</div>

			{hasFiles && (
				<FileActionsIsland
					allFiles={filesList}
					selectedFiles={selectedFiles}
					smartSizeTotals={sizeTotals}
					convertSelectedFiles={openControlsModal}
					deleteSelectedFiles={deleteSelectedFiles}
					archiveSelectedFiles={() => {
						setIsLoading(true);
						archiveSelectedFiles();
					}}
				/>
			)}

			{showControls && (
				<Modal title="Controls" closeModal={closeControlsModal}>
					<ControlsPanel
						values={fileSettings}
						onChange={handleControl}
						onSelect={handleControl}
						convertFiles={convertSelectedFiles}
						cancelConvert={closeControlsModal}
					/>
				</Modal>
			)}

			{isLoading && (
				<Processing cancelProcessing={cancelAction}>
					Processing files...
				</Processing>
			)}
		</section>
	);
};

export default FilesPanel;
