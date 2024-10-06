import { ChangeEvent, RefObject } from "react";
import styles from "../../css/shared/NumberInput.module.scss";

interface Props {
	id?: string;
	name?: string;
	value: number | string;
	isDisabled?: boolean;
	inputRef?: RefObject<HTMLInputElement>;
	placeholder?: string;
	onChange: (name: string, value: number) => void;
}

// Only numbers & periods

const NumberInput = ({
	id,
	name,
	inputRef,
	value,
	isDisabled,
	onChange,
	placeholder,
	...rest
}: Props) => {
	const enforceNums = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value: newVal } = e.target;
		// if (isNaN(newVal as unknown as number) && newVal !== ".") return;
		console.log("newVal", newVal);
		const numsOnly = newVal.replace(/[^0-9.0-9]/g, "");

		return onChange && onChange(name, Number(numsOnly));
	};

	return (
		<div className={styles.NumberInput}>
			<input
				ref={inputRef}
				type="text"
				name={name}
				id={id}
				value={value}
				onChange={enforceNums}
				disabled={isDisabled}
				placeholder={placeholder}
				className={styles.NumberInput_input}
				{...rest}
			/>
		</div>
	);
};

export default NumberInput;
