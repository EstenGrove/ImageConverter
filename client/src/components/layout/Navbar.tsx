import React from "react";
import sprite from "../../assets/icons/files.svg";
import styles from "../../css/layout/Navbar.module.scss";
import { NavLink } from "react-router-dom";

type Props = {};

const MenuIcon = () => {
	return (
		<li className={styles.MenuIcon}>
			<svg className={styles.MenuIcon_icon}>
				<use xlinkHref={`${sprite}#icon-menu1`}></use>
			</svg>
		</li>
	);
};

const Navbar = ({}: Props) => {
	return (
		<nav className={styles.Navbar}>
			<ul className={styles.Navbar_list}>
				<li className={styles.Navbar_list_item}>
					<NavLink to="/" className={styles.Navbar_list_item_link}>
						Uploads
					</NavLink>
				</li>
				<li className={styles.Navbar_list_item}>
					<NavLink to="/files" className={styles.Navbar_list_item_link}>
						Files Manager
					</NavLink>
				</li>
				<li className={styles.Navbar_list_item}>
					<NavLink to="/editor" className={styles.Navbar_list_item_link}>
						Editor
					</NavLink>
				</li>
			</ul>
			{/*  */}
			{/*  */}
		</nav>
	);
};

export default Navbar;
