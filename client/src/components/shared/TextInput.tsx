import { ChangeEvent, RefObject } from "react";
import styles from "../../css/shared/TextInput.module.scss";

interface Props {
	id?: string;
	name?: string;
	value?: string;
	isDisabled?: boolean;
	inputRef?: RefObject<HTMLInputElement>;
	placeholder?: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const TextInput = ({
	id,
	name,
	inputRef,
	value,
	isDisabled,
	onChange,
	placeholder,
	...rest
}: Props) => {
	return (
		<div className={styles.TextInput}>
			<input
				ref={inputRef}
				type="text"
				name={name}
				id={id}
				value={value}
				onChange={onChange}
				disabled={isDisabled}
				placeholder={placeholder}
				className={styles.TextInput_input}
				{...rest}
			/>
		</div>
	);
};

export default TextInput;
