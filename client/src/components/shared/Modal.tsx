import { ReactNode, useRef } from "react";
import sprite from "../../assets/icons/converter.svg";
import styles from "../../css/shared/Modal.module.scss";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";

type Props = {
	title?: string;
	closeModal: () => void;
	children?: ReactNode;
};

const Modal = ({ title, closeModal, children }: Props) => {
	const modalRef = useRef<HTMLDivElement>(null);
	useLockBodyScroll();
	useOutsideClick(modalRef, () => {
		closeModal();
	});

	return (
		<div ref={modalRef} className={styles.Modal}>
			<div className={styles.Modal_top}>
				<h3 className={styles.Modal_top_title}>{title}</h3>
				<svg className={styles.Modal_top_close}>
					<use xlinkHref={`${sprite}#icon-clear`}></use>
				</svg>
			</div>
			<div className={styles.Modal_inner}>{children}</div>
		</div>
	);
};

export default Modal;
