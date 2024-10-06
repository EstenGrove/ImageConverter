import React from "react";
import styles from "../../css/uploads/FileItemPreview.module.scss";
import { FileItem } from "./types";

type Props = {
	fileItem: FileItem;
};

const FileItemPreview = ({ fileItem }: Props) => {
	const { file, src } = fileItem;
	return (
		<div className={styles.FileItemPreview}>
			<img src={src} alt={file.name} className={styles.FileItemPreview_img} />
		</div>
	);
};

export default FileItemPreview;
