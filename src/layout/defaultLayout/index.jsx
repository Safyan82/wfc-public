import React from 'react';
import { Navbar } from '../../components/navbar';
import { Outlet } from "react-router-dom";

export function DefaultLayout(){
    return(
        <div>
            <Navbar/>
            <Outlet/>
        </div>
    )
}