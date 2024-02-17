import React from 'react';
import { Navbar } from '../../components/navbar';
import { Outlet } from "react-router-dom";
import { useSelector } from 'react-redux';
import Spinner from '../../components/spinner';

export function DefaultLayout({themeData, themeLoading, refetchTheme}){
    const {isModalOpen} = useSelector(state => state.searchReducer);

    return(
        <div style={isModalOpen?{overflow:'hidden'}:{}}>
            {themeLoading?
            <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Spinner color={'#ff7a53'} fontSize={80}/>
            </div>
            :
            <>
                <Navbar themeData={themeData} themeLoading={themeLoading} refetchTheme={refetchTheme} />
                {/* {isModalOpen? null: */}
                    <Outlet/>
                {/* } */}
            </>
            }
        </div>
    )
}