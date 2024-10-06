import { DragEvent, ReactNode } from "react";
import styles from "../../css/files/FilesTableBody.module.scss";

type Props = {
	onFileDrop?: (e: DragEvent<HTMLInputElement>) => void;
	onFileDragOver?: (e: DragEvent<HTMLInputElement>) => void;
	children?: ReactNode;
};

const FilesTableBody = ({ children, onFileDragOver, onFileDrop }: Props) => {
	// sets 'isDragging', forwards event, not necessary but used for UI indicators
	const dragHandler = (e: DragEvent) => {
		e.preventDefault();
		return onFileDragOver && onFileDragOver(e as DragEvent<HTMLInputElement>);
	};

	// handles the actual filelist dropping event
	const dropHandler = (e: DragEvent) => {
		e.preventDefault();
		return onFileDrop && onFileDrop(e as DragEvent<HTMLInputElement>);
	};

	return (
		<div
			className={styles.FilesTableBody}
			onDragOver={dragHandler}
			onDrop={dropHandler}
		>
			{/*  */}
			{children}
		</div>
	);
};

export default FilesTableBody;
