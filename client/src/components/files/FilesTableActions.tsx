import React from "react";
import sprite from "../../assets/icons/converter.svg";
import sprite2 from "../../assets/icons/files.svg";
import styles from "../../css/files/FilesTableActions.module.scss";

type Props = {};

const ArchiveButton = () => {
	return (
		<button className={styles.ArchiveButton}>
			<svg className={styles.ArchiveButton_icon}>
				<use xlinkHref={`${sprite2}#icon-document-zip1`}></use>
			</svg>
			{/* <span> Zip Files</span> */}
		</button>
	);
};

const FilesTableActions = ({}: Props) => {
	return (
		<div className={styles.FilesTableActions}>
			<ArchiveButton />
			{/*  */}
		</div>
	);
};

export default FilesTableActions;
