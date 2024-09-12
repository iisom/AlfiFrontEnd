import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useMatch, useResolvedPath } from 'react-router-dom';
import { PiUserCircleDuotone } from "react-icons/pi";


export default function Navbar() {
    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    useEffect(() => {
        const handler = (e) => {
            if (!menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handler);

        return () => {
            document.removeEventListener('mousedown', handler);
        };
    }, []);

    return (
        <div className='header-nav closebtn' ref={menuRef}>
        <PiUserCircleDuotone className='menu-trigger' onClick={() => setOpen(!open)} />
            <div className={`sidepanel ${open ? 'active' : 'inactive'}`}>
                <NavLink to="/" onClick={() => setOpen(false)}>Alfi</NavLink>
                <ul>
                    <DropdownItem to={'/serviceOne'}>User Webpage</DropdownItem>
                    <DropdownItem to={'/serviceTwo'}>Browsing Webpage</DropdownItem>
                    <DropdownItem to={'/serviceThree'}>Single Item Webpage</DropdownItem>
                    <DropdownItem to={'/serviceFour'}>Admin Webpage</DropdownItem>
                    <DropdownItem to={'/identity'}>Identity</DropdownItem>
                </ul>
            </div>
        </div>
    );
}

function DropdownItem({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? 'active' : 'dropdownItem'}>
            <NavLink to={to} {...props}>
                {children}
            </NavLink>
        </li>
    );
}

