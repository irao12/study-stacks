import React from 'react'
import Link from 'next/link'
import styles from './navbar.module.css'

export default function Navbar({ user }) {
  return (
    <nav className={`${styles.navSection} navbar navbar-light justify-content-between p-3`}>
        <Link href="/">
            <h4 className='m-0'>StudyStacks</h4>
        </Link>
        <div className="nav-buttons d-flex gap-3">
            {user !== null && <Link href="/classes">Classes</Link>}
            {user === null ? (<Link href="/login">Log In</Link>) : (<Link href="/logout">Log Out</Link>)}
        </div>
    </nav>
  )
}