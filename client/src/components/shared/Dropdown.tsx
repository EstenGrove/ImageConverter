import { useRef, useState } from "react";
import sprite from "../../assets/icons/converter.svg";
import styles from "../../css/shared/Dropdown.module.scss";
import { useOutsideClick } from "../../hooks/useOutsideClick";

type ItemProps = {
	item: string;
	isSelected: boolean;
	selectItem: () => void;
};
const MenuItem = ({ item, isSelected = false, selectItem }: ItemProps) => {
	return (
		<li
			onClick={selectItem}
			className={styles.MenuItem}
			data-item-selected={isSelected.toString()}
		>
			<span>{item}</span>
		</li>
	);
};

type MenuProps = {
	items: string[];
	selectedItem: string;
	closeMenu: () => void;
	selectItem: (item: string) => void;
};
const DropdownMenu = ({
	closeMenu,
	items,
	selectItem,
	selectedItem,
}: MenuProps) => {
	const menuRef = useRef<HTMLDivElement>(null);
	useOutsideClick(menuRef, () => {
		closeMenu();
	});
	return (
		<div ref={menuRef} className={styles.DropdownMenu}>
			<ul className={styles.DropdownMenu_list}>
				{items &&
					items.map((item, idx) => (
						<MenuItem
							key={item + idx}
							item={item}
							isSelected={selectedItem === item}
							selectItem={() => selectItem(item)}
						/>
					))}
			</ul>
		</div>
	);
};

type Props = {
	name: string;
	value: string;
	items: string[];
	onSelect: (name: string, item: string) => void;
};

const Dropdown = ({ name, value = "", items, onSelect }: Props) => {
	const [showMenu, setShowMenu] = useState(false);
	const [selectedItem, setSelectedItem] = useState<string>(value);

	const selectItem = (item: string) => {
		if (selectedItem === item) {
			onSelect(name, "");
			return setSelectedItem("");
		}
		onSelect(name, item);
		setSelectedItem(item);
	};

	const openMenu = () => {
		if (showMenu) {
			return setShowMenu(false);
		}
		setShowMenu(true);
	};

	return (
		<div className={styles.Dropdown}>
			<div className={styles.Dropdown_input} onClick={openMenu}>
				<div>{selectedItem ? selectedItem : "Choose option"}</div>
				<svg className={styles.Dropdown_input_caret}>
					<use xlinkHref={`${sprite}#icon-arrow_drop_down`}></use>
				</svg>
				{showMenu && (
					<DropdownMenu
						items={items}
						selectItem={selectItem}
						selectedItem={selectedItem}
						closeMenu={() => setShowMenu(false)}
					/>
				)}
			</div>
		</div>
	);
};

export default Dropdown;
