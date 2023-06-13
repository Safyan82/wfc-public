import React from 'react';
import {SearchOutlined} from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { Input } from "antd";
export const AddProperty=({back})=>{
    return(
        <>
            
            <div className="sidebarheader">
                <div className='sidebarheader-innerText'>

                    <div className='sidebarheader-inner' onClick={back}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </div>
                    <span className='prop-text'>Add properties</span>
                </div>
            </div>
            <div className='content-text'>
                Properties are fields that capture and store information.
                
                    <Input 
                        className='prop-search'
                        suffix={<SearchOutlined/>}
                        placeholder='Search properties'
                    />

            </div>
        </>
    )
}