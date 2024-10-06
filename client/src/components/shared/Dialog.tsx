import { ReactNode, useRef } from "react";
import sprite from "../../assets/icons/converter.svg";
import styles from "../../css/shared/Dialog.module.scss";
import { useOutsideClick } from "../../hooks/useOutsideClick";

type Props = {
	title: string;
	icon: keyof typeof icons;
	closeDialog: () => void;
	onCancel: () => void;
	onConfirm: () => void;
	children?: ReactNode;
};

const icons = {
	zip: "file-archive-o",
	images: "images",
	delete: "delete",
	save: "save",
	save2: "save_alt",
} as const;

type ActionProps = {
	onCancel: () => void;
	onConfirm: () => void;
};

const ActionsFooter = ({ onCancel, onConfirm }: ActionProps) => {
	return (
		<div className={styles.ActionsFooter}>
			<button
				type="button"
				onClick={onCancel}
				className={styles.ActionsFooter_cancelBtn}
			>
				Cancel
			</button>
			<button
				type="button"
				onClick={onConfirm}
				className={styles.ActionsFooter_confirmBtn}
			>
				Confirm
			</button>
		</div>
	);
};

const Dialog = ({ title, icon, children, closeDialog }: Props) => {
	const dialogRef = useRef<HTMLElement>(null);
	useOutsideClick(dialogRef, () => {
		closeDialog();
	});
	return (
		<aside ref={dialogRef} className={styles.Dialog}>
			<div className={styles.Dialog_top}>
				<svg className={styles.Dialog_top_close}>
					<use xlinkHref={`${sprite}#icon-clear`}></use>
				</svg>
			</div>
			<div className={styles.Dialog_inner}>
				<div className={styles.Dialog_inner_header}>
					<div className={styles.Dialog_inner_header_wrapper}>
						<svg className={styles.Dialog_inner_header_wrapper_icon}>
							<use
								xlinkHref={`${sprite}#icon-${icons[icon as keyof object]}`}
							></use>
						</svg>
					</div>
					<h3 className={styles.Dialog_inner_header_title}>{title}</h3>
				</div>
				<div className={styles.Dialog_inner_childs}>{children}</div>
			</div>
			<div className={styles.Dialog_actions}>
				<ActionsFooter />
			</div>
		</aside>
	);
};

export default Dialog;
