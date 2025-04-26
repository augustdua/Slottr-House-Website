import React from 'react';
import cn from 'classnames'; // Optional, if you want easier class handling (optional)



export const Card = ({ children, className }) => {
    return (
        <div className={cn('bg-white rounded-lg shadow-md', className)}>
            {children}
        </div>
    );
};

export const CardContent = ({ children, className }) => {
    return (
        <div className={cn('p-6', className)}>
            {children}
        </div>
    );
};