// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    return (
        <>
            <Header />
            <main style={{ padding: '20px' }}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default Layout;
