import styles from "../../css/uploads/FileList.module.scss";
import FileListItem from "./FileListItem";
import { FileItem } from "./types";

type Props = {
	files: FileItem[];
	selectedFiles: FileItem[];
	selectFile: (file: FileItem) => void;
};

const isSelected = (file: File, selectedFiles: FileItem[]): boolean => {
	return !!selectedFiles.find((cur) => cur.file.name === file.name);
};

const FileList = ({ files, selectFile, selectedFiles }: Props) => {
	return (
		<div className={styles.FileList}>
			<ul className={styles.FileList_list}>
				{files &&
					files.length > 0 &&
					files.map((file, idx) => (
						<FileListItem
							key={file.file.name + idx}
							fileItem={file}
							selectFile={() => selectFile(file)}
							isSelected={isSelected(file.file, selectedFiles)}
						/>
					))}
			</ul>
		</div>
	);
};

export default FileList;
