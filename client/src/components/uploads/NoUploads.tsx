import { ReactNode } from "react";
import sprite from "../../assets/icons/converter.svg";
import styles from "../../css/uploads/NoUploads.module.scss";

type Props = {
	children?: ReactNode;
};

const NoUploads = ({ children }: Props) => {
	return (
		<div className={styles.NoUploads}>
			<svg className={styles.NoUploads_icon}>
				<use xlinkHref={`${sprite}#icon-images`}></use>
			</svg>
			<div className={styles.NoUploads_text}>No files uploaded yet</div>
			{children}
		</div>
	);
};

export default NoUploads;
