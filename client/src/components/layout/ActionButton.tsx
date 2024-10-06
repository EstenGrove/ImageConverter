import { ReactNode } from "react";
import sprite from "../../assets/icons/converter.svg";
import styles from "../../css/layout/ActionButton.module.scss";

const icons = {
	delete: "delete",
	zip: "file-archive-o",
	more: "keyboard_control",
	upload: "file_upload",
};

type Props = {
	icon: string;
	isDisabled?: boolean;
	onClick: () => void;
	title?: string;
	children?: ReactNode;
};
const ActionButton = ({
	icon,
	onClick,
	isDisabled = false,
	title,
	children,
}: Props) => {
	return (
		<button
			type="button"
			disabled={isDisabled}
			onClick={onClick}
			title={title}
			className={styles.ActionButton}
		>
			<svg className={styles.ActionButton_icon}>
				<use xlinkHref={`${sprite}#icon-${icons[icon as keyof object]}`}></use>
			</svg>
			{children}
		</button>
	);
};

export default ActionButton;
