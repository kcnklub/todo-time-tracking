import { signOut } from "next-auth/react"
import React from "react"
import styles from "./Header.module.css"


const Header = () => {
    return (
        <div className={styles.header}>
            <div className={styles.header_title}>Todo Time Tracker</div>
            <div className="flex-grow" />
            <button
                className={styles.header_button}
                onClick={() => void signOut()}
            >
                <span>sign out</span>
            </button>
        </div>
    )
}

export default Header
