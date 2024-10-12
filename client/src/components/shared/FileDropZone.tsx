import { useState, ChangeEvent, DragEvent } from "react";
import styles from "../../css/shared/FileDropZone.module.scss";

const dragStyles = {
	border: `2px dashed rgb(109, 40, 217)`,
};

type Props = {
	name?: string;
	id?: string;
	hasFile?: boolean;
	onFile: (e: ChangeEvent<HTMLInputElement>) => void;
	onFileDrop?: (e: DragEvent<HTMLInputElement>) => void;
	onFileDragOver?: (e: DragEvent<HTMLInputElement>) => void;
	multiple?: boolean;
	accept?: string;
};

// Loose file-type validation: checks whether the uploaded filetype matches our 'accept' prop
// - Supports categories: "image/*" will match provided there's an "image" type in the file's mimeType
// - Supports specifics: "image/png" will match provded the mimeType matches at least one of the supported types
// - Supports multi-specifics: "image/png, image/jpg"
const isAcceptedType = (file: File, type: string): boolean => {
	if (!type) return true;
	const mimeType = file?.type;
	const isGeneric = type.includes("/*");

	if (isGeneric) {
		// we're looking for a generic type within our category
		const fileCategory = type.split("/")[0];
		const hasCategory = mimeType.includes(fileCategory);
		return hasCategory;
	} else {
		// we're looking for a specific type
		return mimeType.includes(type);
	}
};

const FileDropZone = ({
	name = "fileUpload",
	id = "fileUpload",
	hasFile = false,
	onFile,
	onFileDrop,
	onFileDragOver,
	accept = "image/*",
	multiple = false,
}: Props) => {
	const [isDragging, setIsDragging] = useState(false);

	// sets 'isDragging', forwards event
	const dragHandler = (e: DragEvent) => {
		setIsDragging(true);
		return onFileDragOver && onFileDragOver(e as DragEvent<HTMLInputElement>);
	};

	// resets 'isDragging', forwards event
	const dropHandler = (e: DragEvent) => {
		setIsDragging(false);
		const { files } = e.dataTransfer;
		const file = files?.[0];
		const isValid = isAcceptedType(file, accept);
		if (!isValid) {
			e.preventDefault();
			return alert(`Invalid file type: ${file.type}`);
		}
		return onFileDrop && onFileDrop(e as DragEvent<HTMLInputElement>);
	};

	return (
		<div className={styles.FileDropZone} style={isDragging ? dragStyles : {}}>
			<div
				className={styles.FileDropZone_inner}
				onDragOver={dragHandler}
				onDrop={dropHandler}
			>
				<input
					type="file"
					name={name}
					id={id}
					className={styles.FileDropZone_inner_input}
					accept={accept}
					multiple={multiple}
					onChange={onFile}
				/>
				<p className={styles.FileDropZone_inner_text}>
					Select files from your computer or drag files here.
				</p>
				<label
					htmlFor={id}
					className={
						hasFile
							? styles.FileDropZone_inner_label_hasFile
							: styles.FileDropZone_inner_label
					}
				>
					{!hasFile ? "Choose a file" : `✓ File Uploaded!`}
				</label>
			</div>
		</div>
	);
};

export default FileDropZone;
