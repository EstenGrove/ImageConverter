import React from "react";
import styles from "../css/pages/FilesManagerPage.module.scss";
import FilesPanel from "../components/layout/FilesPanel";

type Props = {};

const FilesManagerPage = ({}: Props) => {
	return (
		<div className={styles.FilesManagerPage}>
			<FilesPanel />
			{/*  */}
			{/*  */}
		</div>
	);
};

export default FilesManagerPage;
