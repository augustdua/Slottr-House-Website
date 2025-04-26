// src/components/SelectableButton.jsx
import React from 'react';
import classNames from 'classnames'; // Optional, if you want easier class handling (optional)

const SelectableButton = ({ selected = false, onClick, children }) => {
    return (
        <button
            onClick={onClick}
            className={classNames(
                'w-full flex items-center justify-evenly px-4 py-3 rounded-3xl text-white font-semibold transition-all max-w-90',
                selected
                    ? 'bg-gradient-to-r from-[#FF073A] to-[#EB3437]'
                    : 'backdrop-blur-lg border-t border-white/30 shadow-inner',
                !selected &&
                'bg-white/10 shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.08),inset_0px_2px_4px_0px_rgba(255,255,255,0.3),inset_0px_-2px_4px_0px_rgba(0,0,0,0.3)]'
            )}
        >
            {children}
        </button>

    );
};

export default SelectableButton;
