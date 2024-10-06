import { ReactNode } from "react";
import sprite from "../../assets/icons/converter.svg";
import styles from "../../css/layout/UploadActions.module.scss";

// REQUIREMENTS:
// - Select All (to select all files in the uploads panel)
// - Convert selected
// - Delete all

type SelectProps = {
	isAllSelected: boolean;
	selectAll: () => void;
};

const marked = "check_box";
const unmarked = "check_box_outline_blank";

const SelectAllButton = ({ isAllSelected = false, selectAll }: SelectProps) => {
	return (
		<button
			type="button"
			onClick={selectAll}
			className={styles.SelectAllButton}
		>
			<svg className={styles.SelectAllButton_icon}>
				<use
					xlinkHref={`${sprite}#icon-${isAllSelected ? marked : unmarked}`}
				></use>
			</svg>
			<span>{isAllSelected ? "All Selected" : "Select All"}</span>
		</button>
	);
};

type Props = {
	selectAll: () => void;
	isAllSelected: boolean;
	children?: ReactNode;
};

const UploadActions = ({
	selectAll,
	isAllSelected = false,
	children,
}: Props) => {
	return (
		<div className={styles.UploadActions}>
			<div className={styles.UploadActions_left}>
				<SelectAllButton selectAll={selectAll} isAllSelected={isAllSelected} />
			</div>
			<div className={styles.UploadActions_right}>{children}</div>
		</div>
	);
};

export default UploadActions;
