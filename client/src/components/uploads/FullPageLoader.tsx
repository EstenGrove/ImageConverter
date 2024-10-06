import { ReactNode } from "react";
import styles from "../../css/uploads/FullPageLoader.module.scss";

type Props = { children?: ReactNode };

const FullPageLoader = ({ children }: Props) => {
	return (
		<aside className={styles.FullPageLoader}>
			<div className={styles.FullPageLoader_inner}>
				<h2>Loading...downloading files</h2>
				<div className={styles.FullPageLoader_inner_children}>{children}</div>
			</div>
		</aside>
	);
};

export default FullPageLoader;
