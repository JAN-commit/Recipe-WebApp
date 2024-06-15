import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from './SideBar';

export default function TitleNav() {
    const navigate = useNavigate();
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(!!localStorage.getItem('idToken'));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('expiresIn');
        localStorage.removeItem('idToken');
        localStorage.removeItem('localId');
        localStorage.removeItem('expiryTime');
        localStorage.removeItem('back')
        setIsUserLoggedIn(false);
        setIsDropdownOpen(false);
        navigate('/');
    };

    const myfavorite = () => {
        setIsDropdownOpen(false);
        navigate('/RecipeFavorite');
    };


    useEffect(() => {
        const token = localStorage.getItem('idToken');
        setIsUserLoggedIn(!!token);
    }, [localStorage.getItem('idToken')]);


    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (isDropdownOpen && !e.target.closest('.dropdown-content') && !e.target.closest('.avatar')) {
                setIsDropdownOpen(false);
            }
        };
        
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [isDropdownOpen]);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <div className='sticky top-0 z-20'>
            <div className="navbar bg-base-100">
    <SideBar />
                <div className="flex-1">
                    {/* <h1 className="text-xl font-bold">Recipe Web App</h1> */}
                </div>
                <div className="flex-none">
                    {isUserLoggedIn && (
                        <div className="dropdown dropdown-end ">
                            <div
                                tabIndex="0"
                                role="button"
                                className="btn btn-ghost btn-circle avatar"
                                onClick={toggleDropdown}
                            >
                                <div className="w-10 rounded-full">
                                    <img alt="Avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                                </div>
                            </div>
                            {isDropdownOpen && (
                                <ul tabIndex="0" className="menu menu-sm dropdown-content p-2 shadow-sm bg-base-200 rounded-box w-52 ">
                                    <li>
                                        <a className="justify-between" onClick={myfavorite}>
                                            Favorites
                                        </a>
                                    </li>
                                    <li onClick={handleLogout} className='text-red-500  rounded-lg'><a>Logout</a></li>
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
