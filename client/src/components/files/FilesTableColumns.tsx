import React from "react";
import sprite from "../../assets/icons/converter.svg";
import styles from "../../css/files/FilesTableColumns.module.scss";

type ColProps = {
	onClick: () => void;
};

const filterIcon = (
	<svg className={styles.filterIcon}>
		<use xlinkHref={`${sprite}#icon-filter_list_alt`}></use>
	</svg>
);

const NameCol = ({ onClick }: ColProps) => {
	return (
		<div onClick={onClick} className={styles.NameCol}>
			<span>File name</span>
			{filterIcon}
		</div>
	);
};

const TypeCol = ({ onClick }: ColProps) => {
	return (
		<div onClick={onClick} className={styles.TypeCol}>
			<span>Type</span>
			{filterIcon}
		</div>
	);
};

const SizeCol = ({ onClick }: ColProps) => {
	return (
		<div onClick={onClick} className={styles.SizeCol}>
			<span>Size</span>
			{filterIcon}
		</div>
	);
};

const ActionsCol = () => {
	return <div className={styles.ActionsCol}>Actions</div>;
};

const marked = "check_box";
const unmarked = "check_box_outline_blank";

type SelectAllProps = {
	selectAll: () => void;
	isAllSelected: boolean;
};
const SelectAllCol = ({ selectAll, isAllSelected = false }: SelectAllProps) => {
	return (
		<div onClick={selectAll} className={styles.SelectAllCol}>
			<svg className={styles.SelectAllCol_icon}>
				<use
					xlinkHref={`${sprite}#icon-${isAllSelected ? marked : unmarked}`}
				></use>
			</svg>
		</div>
	);
};

type SortBy = "name" | "type" | "size";

type Props = {
	selectAll: () => void;
	sortBy: (by: SortBy) => void;
	isAllSelected: boolean;
};

const FilesTableColumns = ({ selectAll, isAllSelected, sortBy }: Props) => {
	return (
		<div className={styles.FilesTableColumns}>
			<SelectAllCol selectAll={selectAll} isAllSelected={isAllSelected} />
			<NameCol onClick={() => sortBy("name")} />
			<TypeCol onClick={() => sortBy("type")} />
			<SizeCol onClick={() => sortBy("size")} />
			<ActionsCol />
		</div>
	);
};

export default FilesTableColumns;
