import React from "react";
import styles from "../../css/layout/ActivePreviewPanel.module.scss";

type Props = { fileSrc: string };

// REQUIREMENTS:
// - Shows active file being edited

const ActivePreviewPanel = ({ fileSrc }: Props) => {
	return (
		<section className={styles.ActivePreviewPanel}>
			<div className={styles.ActivePreviewPanel_top}>
				<h2>File: 'Filename-Here.png'</h2>
			</div>
			<div className={styles.ActivePreviewPanel_preview}>
				<img
					src={fileSrc}
					alt="File Preview"
					className={styles.ActivePreviewPanel_preview_img}
				/>
			</div>
		</section>
	);
};

export default ActivePreviewPanel;
