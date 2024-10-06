import styles from "../../css/files/HoverPreview.module.scss";

type Props = {
	hoverSrc: string;
	alt?: string;
};

const HoverPreview = ({ hoverSrc, alt }: Props) => {
	return (
		<div className={styles.HoverPreview}>
			<img
				src={hoverSrc}
				alt={alt ?? "Preview File"}
				className={styles.HoverPreview_img}
			/>
		</div>
	);
};

export default HoverPreview;
