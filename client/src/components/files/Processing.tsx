import { ReactNode } from "react";
import styles from "../../css/files/Processing.module.scss";
import Spinner from "../shared/Spinner";

type Props = {
	cancelProcessing: () => void;
	children: ReactNode;
};

type CancelProps = {
	onClick: () => void;
};

const CancelButton = ({ onClick }: CancelProps) => {
	return (
		<button type="button" onClick={onClick} className={styles.CancelButton}>
			<span>Cancel</span>
		</button>
	);
};

const Processing = ({ children, cancelProcessing }: Props) => {
	return (
		<div className={styles.Processing}>
			<div className={styles.Processing_inner}>
				<Spinner />
				{children}
				<CancelButton onClick={cancelProcessing} />
			</div>
		</div>
	);
};

export default Processing;
