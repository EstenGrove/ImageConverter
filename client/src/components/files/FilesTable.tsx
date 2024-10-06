import { ChangeEvent, DragEvent, useEffect, useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import styles from "../../css/files/FilesTable.module.scss";
import sprite from "../../assets/icons/converter.svg";
// components
import NoUploads from "../uploads/NoUploads";
import FilesTableBody from "./FilesTableBody";
import FilesTableHeader from "./FilesTableHeader";
import FilesTableColumns from "./FilesTableColumns";
import FilesTableListItem from "./FilesTableListItem";

type Props = {
	filesList: File[];
	selectedFiles: File[];
	isAllSelected: boolean;
	selectFile: (file: File) => void;
	removeFile: (file: File) => void;
	shiftSelectFile: (file: File) => void;
	selectAll: () => void;
	onFiles?: (files: File[]) => void;
};

type FallbackProps = {
	isLoading: boolean;
	hasData: boolean;
	onFileDragOver?: () => void;
	onFileDrop?: (e: DragEvent<HTMLInputElement>) => void;
};

const UploadMsg = () => {
	return (
		<div className={styles.UploadMsg}>
			<svg className={styles.UploadMsg_icon}>
				<use xlinkHref={`${sprite}#icon-cloud_upload`}></use>
			</svg>
			<span>Click upload or drag files here...</span>
		</div>
	);
};

const FallbackStates = ({ isLoading, hasData, ...rest }: FallbackProps) => {
	if (isLoading) {
		return (
			<FilesTableBody {...rest}>
				<span>Loading...</span>
			</FilesTableBody>
		);
	}

	if (!hasData) {
		return (
			<FilesTableBody {...rest}>
				<NoUploads>
					<UploadMsg />
				</NoUploads>
			</FilesTableBody>
		);
	}

	return null;
};

const isFileSelected = (file: File, selectedFiles: File[]) => {
	return selectedFiles.some((item) => item.name === file.name);
};

const searchFiles = (value: string, allFiles: File[]): File[] => {
	if (!value || value === "") return [];
	const lowerVal = value.toLowerCase();

	return allFiles.filter((file) => {
		const lowerName = file.name.toLowerCase();
		return lowerName.includes(lowerVal) || lowerName.startsWith(lowerVal);
	});
};

type SortBy = "name" | "type" | "size";

interface Sort {
	by: SortBy;
	isAscending: boolean;
}

// Sorting functions
const sortFilters = {
	name: {
		isAsc: (files: File[]) => {
			return files.sort((a, b) => a.name.localeCompare(b.name));
		},
		isDesc: (files: File[]) => {
			return files.sort((a, b) => b.name.localeCompare(a.name));
		},
	},
	type: {
		isAsc: (files: File[]) => {
			return files.sort((a, b) => a.type.localeCompare(b.type));
		},
		isDesc: (files: File[]) => {
			return files.sort((a, b) => b.type.localeCompare(a.type));
		},
	},
	size: {
		isAsc: (files: File[]) => {
			return files.sort((a, b) => b.size - a.size);
		},
		isDesc: (files: File[]) => {
			return files.sort((a, b) => a.size - b.size);
		},
	},
};

const FilesTable = ({
	filesList,
	removeFile,
	selectedFiles,
	selectFile,
	selectAll,
	shiftSelectFile,
	isAllSelected,
	onFiles, // when dragging/dropping files into body
}: Props) => {
	const winSize = useWindowSize();
	const [searchVal, setSearchVal] = useState<string>("");
	// can remove this, not needed anymore!!!
	const [searchResults, setSearchResults] = useState<File[]>([]);
	const [files, setFiles] = useState<File[]>(filesList);
	const [sort, setSort] = useState<Sort>({
		by: "name",
		isAscending: true,
	});
	const hasFiles: boolean = filesList && filesList.length > 0;
	const isSearching: boolean = !!searchVal && searchVal !== "";

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSearchVal(value);

		const matches = searchFiles(value, files);
		setSearchResults(matches);
	};

	const sortBy = (by: SortBy) => {
		const sortGroup = sortFilters[by];

		if (by === sort.by) {
			const direction = sort.isAscending ? "isDesc" : "isAsc";
			const newSorted = sortGroup[direction](files);
			setFiles(newSorted);
			setSort({
				...sort,
				isAscending: direction === "isAsc" ? true : false,
			});
		} else {
			const direction = "isAsc";
			const newSorted = sortGroup[direction](files);
			setFiles(newSorted);
			setSort({
				by: by,
				isAscending: true,
			});
		}
	};

	const handleFileDrops = (e: DragEvent) => {
		const { files } = e.dataTransfer;
		const filesList: File[] = [...files];

		return onFiles && onFiles(filesList);
	};

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}

		setFiles(filesList);

		return () => {
			isMounted = false;
		};
	}, [filesList]);

	return (
		<div className={styles.FilesTable}>
			<div className={styles.FilesTable_header}>
				<FilesTableHeader
					filesCount={files.length}
					searchVal={searchVal}
					handleSearch={handleSearch}
				/>
				<FilesTableColumns
					selectAll={selectAll}
					isAllSelected={isAllSelected}
					sortBy={sortBy}
				/>
			</div>
			<FallbackStates
				isLoading={false}
				hasData={files.length > 0}
				onFileDrop={handleFileDrops}
			></FallbackStates>

			{/* SEARCH RESULTS */}
			{isSearching && (
				<FilesTableBody onFileDrop={handleFileDrops}>
					{searchResults &&
						searchResults.map((file, idx) => (
							<FilesTableListItem
								key={file.name + idx}
								windowSize={winSize}
								file={file}
								selectFile={() => selectFile(file)}
								removeFile={() => removeFile(file)}
								shiftSelectFile={() => shiftSelectFile(file)}
								isSelected={isFileSelected(file, selectedFiles)}
							/>
						))}
				</FilesTableBody>
			)}
			{/* FILES LIST */}
			{!isSearching && (
				<FilesTableBody onFileDrop={handleFileDrops}>
					{hasFiles &&
						files.map((file, idx) => (
							<FilesTableListItem
								key={file.name + idx}
								windowSize={winSize}
								file={file}
								selectFile={() => selectFile(file)}
								removeFile={() => removeFile(file)}
								shiftSelectFile={() => shiftSelectFile(file)}
								isSelected={isFileSelected(file, selectedFiles)}
							/>
						))}
				</FilesTableBody>
			)}
		</div>
	);
};

export default FilesTable;
