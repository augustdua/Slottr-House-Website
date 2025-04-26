// src/components/Header.jsx
import React, { useState } from 'react';
import { SearchIcon, SettingsIcon, UserIcon, MenuIcon, XIcon } from 'lucide-react';
import SelectableButton from './button'; // Import your reusable button

const initialNav = [
    { id: 1, name: 'Home page' },
    { id: 2, name: 'Games' },
    { id: 3, name: 'Posts' },
];

const Header = () => {
    const [navItems, setNavItems] = useState(initialNav);
    const [activeId, setActiveId] = useState(1);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNav = (id) => {
        setActiveId(id);
    };

    const commonInactive =
        'bg-[#ffffff0a] border-solid shadow-[inset_0px_1px_0px_#ffffff14] backdrop-blur-[32px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(32px)_brightness(100%)]';
    const commonActive =
        'border-t border-solid border-[#ffffff4c] shadow-[inset_0px_2px_4px_#ffffff4c,inset_0px_-2px_4px_#0000004c] [background:linear-gradient(90deg,rgba(255,7,58,1)_0%,rgba(235,52,55,1)_100%)]';

    return (
        <header className="flex flex-col w-full px-4 md:px-8 lg:px-[100px] py-4 bg-[#292929]">
            <nav className="flex items-center justify-between w-full">
                {/* Logo */}
                <div className="font-bold text-3xl text-white">Logo</div>

                {/* Hamburger icon for small screens */}
                <button
                    className={`flex md:hidden w-10 h-10 items-center justify-center p-2 rounded-[40px] border ${commonInactive}`}
                    onClick={() => setIsMenuOpen(true)}
                >
                    <MenuIcon className="w-5 h-5 text-white" />
                </button>

                {/* Navigation items for larger screens */}
                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => {
                        const isActive = item.id === activeId;
                        return (
                            <div key={item.id} className="w-[153px]">
                                <SelectableButton
                                    selected={isActive}
                                    onClick={() => handleNav(item.id)}
                                >
                                    <span
                                        className={`font-medium text-base ${isActive ? '' : 'opacity-70'}`}
                                    >
                                        {item.name}
                                    </span>
                                </SelectableButton>
                            </div>
                        );
                    })}
                </div>

                {/* Search and buttons for larger screens */}
                <div className="hidden md:flex items-center gap-1.5">
                    <div
                        className={`flex items-center flex-1 px-4 py-[11px] rounded-[40px] border ${commonInactive}`}
                    >
                        <SearchIcon className="w-4 h-4 text-white" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="ml-2 flex-1 bg-transparent border-none p-0 text-sm text-white placeholder-white focus:outline-none"
                        />
                    </div>
                    <button
                        className={`flex w-10 h-10 items-center justify-center p-2 rounded-[40px] border ${commonInactive}`}
                    >
                        <SettingsIcon className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Profile button for larger screens */}
                <button
                    className={`hidden md:flex w-10 h-10 items-center justify-center p-2 rounded-[40px] border ${commonInactive}`}
                >
                    <UserIcon className="w-5 h-5 text-white" />
                </button>
            </nav>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-[#292929] z-50 p-4">
                    <div className="flex justify-between items-center">
                        <div className="font-bold text-3xl text-white">Logo</div>
                        <button
                            className={`flex w-10 h-10 items-center justify-center p-2 rounded-[40px] border ${commonInactive}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <XIcon className="w-5 h-5 text-white" />
                        </button>
                    </div>
                    <div className="mt-8">
                        {/* Search */}
                        <div
                            className={`flex items-center px-4 py-[11px] rounded-[40px] border ${commonInactive}`}
                        >
                            <SearchIcon className="w-4 h-4 text-white" />
                            <input
                                type="text"
                                placeholder="Search"
                                className="ml-2 flex-1 bg-transparent border-none p-0 text-sm text-white placeholder-white focus:outline-none"
                            />
                        </div>

                        {/* Navigation items */}
                        <div className="mt-4">
                            {navItems.map((item) => {
                                const isActive = item.id === activeId;
                                return (
                                    <div key={item.id} className="py-2">
                                        <SelectableButton
                                            selected={isActive}
                                            onClick={() => {
                                                handleNav(item.id);
                                                setIsMenuOpen(false);
                                            }}
                                        >
                                            <span
                                                className={`font-medium text-base ${isActive ? '' : 'opacity-70'}`}
                                            >
                                                {item.name}
                                            </span>
                                        </SelectableButton>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Settings and Profile */}
                        <div className="mt-4">
                            <button className="flex items-center gap-2 py-2">
                                <SettingsIcon className="w-5 h-5 text-white" />
                                <span className="text-white">Settings</span>
                            </button>
                            <button className="flex items-center gap-2 py-2">
                                <UserIcon className="w-5 h-5 text-white" />
                                <span className="text-white">Profile</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;