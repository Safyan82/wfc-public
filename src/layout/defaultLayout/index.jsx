import React from 'react';
import { Navbar } from '../../components/navbar';
import { Outlet } from "react-router-dom";
import { SearchView } from '../../components/searchView/searchView';
import { useSelector } from 'react-redux';

export function DefaultLayout(){
    const {isModalOpen} = useSelector(state => state.searchReducer);
    
    return(
        <div style={isModalOpen?{overflow:'hidden'}:{}}>
            <Navbar/>
            {isModalOpen? null:
            <Outlet/>
            }
        </div>
    )
}