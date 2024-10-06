import {
	ChangeEvent,
	ComponentPropsWithRef,
	DragEvent,
	RefObject,
} from "react";
import sprite from "../../assets/icons/converter.svg";
import styles from "../../css/uploads/UploadDropZone.module.scss";

type InputProps = {
	name?: string;
	id?: string;
	hasFile?: boolean;
	onFile: (e: ChangeEvent<HTMLInputElement>) => void;
	onFileDrop: (e: DragEvent<HTMLInputElement>) => void;
	onFileDragOver: (e: DragEvent<HTMLInputElement>) => void;
	multiple?: boolean;
	accept?: HTMLInputElement["accept"];
	inputRef?: RefObject<HTMLInputElement>;
};

interface Props extends InputProps, ComponentPropsWithRef<"input"> {}

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

const areValidTypes = (files: File[], type: string): boolean => {
	return files.every((file) => isAcceptedType(file, type));
};

const getInvalidTypes = (files: File[], type: string): string[] => {
	const validTypes: string[] = type.split(", ");
	const invalidTypes: string[] = [];
	for (const name in files) {
		const file = files[name] as File;
		const fileType: string = file.type;
		const isValid = validTypes.includes(fileType);
		if (!isValid) {
			invalidTypes.push(fileType);
		}
	}

	return invalidTypes;
};

const SuccessMsg = () => {
	return (
		<span className={styles.SuccessMsg}>
			<b>✓ </b>File(s) Uploaded!
		</span>
	);
};

const UploadDropZone = ({
	name = "fileUpload",
	id = "fileUpload",
	hasFile = false,
	onFile,
	onFileDrop,
	onFileDragOver,
	accept = "image/*",
	multiple = false,
	inputRef,
	...rest
}: Props) => {
	// sets 'isDragging', forwards event
	const dragHandler = (e: DragEvent) => {
		onFileDragOver(e as DragEvent<HTMLInputElement>);
	};

	// resets 'isDragging', forwards event
	const dropHandler = (e: DragEvent) => {
		const { files } = e.dataTransfer;
		const filesList: File[] = [...files];
		const allValid = areValidTypes(filesList as File[], accept);
		console.log("allValid", allValid);
		if (!allValid) {
			e.preventDefault();
			const invalidTypes = getInvalidTypes(filesList, accept);
			const uniques = Array.from(new Set(invalidTypes));
			return alert(`Invalid file type: ${uniques.join(", ")}`);
		}
		onFileDrop(e as DragEvent<HTMLInputElement>);
	};

	return (
		<div
			className={styles.UploadDropZone}
			onDragOver={dragHandler}
			onDrop={dropHandler}
		>
			<svg className={styles.UploadDropZone_icon}>
				<use xlinkHref={`${sprite}#icon-cloud_upload`}></use>
			</svg>
			<input
				ref={inputRef}
				type="file"
				name={name}
				id={id}
				className={styles.UploadDropZone_input}
				accept={accept}
				multiple={multiple}
				onChange={onFile}
				{...rest}
			/>
			<p className={styles.UploadDropZone_text}>
				Select files from your computer or drag files here.
			</p>
			<label
				htmlFor={id}
				className={
					hasFile
						? styles.UploadDropZone_label_hasFile
						: styles.UploadDropZone_label
				}
			>
				{hasFile && <SuccessMsg />}
				{!hasFile && "Select file(s)"}
			</label>
		</div>
	);
};

export default UploadDropZone;
