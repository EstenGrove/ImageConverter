import styles from "../../css/shared/Spinner.module.scss";

type Props = {
	color?: string;
};

const Spinner = ({ color = "var(--accent)" }: Props) => {
	const css = {
		borderColor: color,
	};
	return <div className={styles.Spinner} style={css}></div>;
};

export default Spinner;
