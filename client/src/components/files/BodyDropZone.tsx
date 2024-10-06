import React, { ChangeEvent, DragEvent } from "react";
import styles from "../../css/files/BodyDropZone.module.scss";
import UploadDropZone from "../uploads/UploadDropZone";

type Props = {
	onFile: (e: ChangeEvent<HTMLInputElement>) => void;
	onFileDrop: (e: DragEvent<HTMLInputElement>) => void;
	onFileDragOver: (e: DragEvent<HTMLInputElement>) => void;
};

const BodyDropZone = (props: Props) => {
	return (
		<div className={styles.BodyDropZone}>
			<UploadDropZone name="dropzone" id="dropzone" {...props} />
		</div>
	);
};

export default BodyDropZone;
