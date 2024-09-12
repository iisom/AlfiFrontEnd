import React from "react";
import { NavLink } from "react-router-dom"

const Navigation = ({links}) => {
    return (
        <nav>
            <ul>
                {links.map((link, index) => {
                    return (
                        <li key={index}>
                            <NavLink
                                className={({ isActive }) => isActive ? 'active' : ''}
                                to={link.path}
                            >
                                {link.name}
                            </NavLink>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}

export default Navigation;