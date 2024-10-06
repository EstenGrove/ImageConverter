import React from "react";
import styles from "../../css/controls/ControlsPanel.module.scss";
import NumberInput from "../shared/NumberInput";
import Dropdown from "../shared/Dropdown";

interface FileSettings {
	quality: string;
	format: "webp" | "avif" | "jpeg" | "png" | "jpg";
	width: number;
	height: number;
}

type Props = {
	values: FileSettings;
	onChange: (name: string, value: string | number) => void;
	onSelect: (name: string, value: string | number) => void;
	convertFiles: () => void;
	cancelConvert: () => void;
};

const formats: string[] = ["webp", "avif", "jpeg", "jpg", "png"];
const quality: string[] = [
	"95%",
	"90%",
	"85%",
	"80%",
	"75%",
	"70%",
	"65%",
	"60%",
	"50%",
	"40%",
	"30%",
];

const ControlsPanel = ({
	values,
	onChange,
	onSelect,
	convertFiles,
	cancelConvert,
}: Props) => {
	return (
		<aside className={styles.ControlsPanel}>
			<div className={styles.ControlsPanel_top}>
				{/*  */}
				{/*  */}
			</div>
			<div className={styles.ControlsPanel_main}>
				<div className={styles.ControlsPanel_main_field}>
					<label htmlFor="quality">
						Quality (.9 is a 10% reduction in quality)
					</label>
					<Dropdown
						name="quality"
						items={quality}
						value={values.quality}
						onSelect={onSelect}
					/>
				</div>
				<div className={styles.ControlsPanel_main_field}>
					<label htmlFor="format">Format (format to convert to)</label>
					<Dropdown
						name="format"
						items={formats}
						value={values.format}
						onSelect={onSelect}
					/>
				</div>
				<div className={styles.ControlsPanel_main_field}>
					<label htmlFor="width">Width (px)</label>
					<NumberInput
						id="width"
						name="width"
						value={values.width}
						onChange={onChange}
					/>
				</div>
				<div className={styles.ControlsPanel_main_field}>
					<label htmlFor="height">Height (px)</label>
					<NumberInput
						id="height"
						name="height"
						value={values.height}
						onChange={onChange}
					/>
				</div>
			</div>
			<div className={styles.ControlsPanel_actions}>
				<button
					type="button"
					onClick={cancelConvert}
					className={styles.ControlsPanel_actions_cancel}
				>
					Cancel
				</button>
				<button
					type="button"
					onClick={convertFiles}
					className={styles.ControlsPanel_actions_convert}
				>
					Convert
				</button>
			</div>
		</aside>
	);
};

export default ControlsPanel;
