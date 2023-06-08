import './editform.css';
import React, { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Button, Divider, Form, Input } from "antd";
import { useLocation } from "react-router-dom";
import DraggableList from '../shuffle';

export const EditForm=()=>{
    const location = useLocation();
    const {title} = location.state;
    const list = [
        {id:1, content:"Branch Name"}, 
        {id:2, content:"Post code"},
        {id:3, content:"Address Line 1"}, 
        {id:4, content:"Address Line2"},
        {id:5, content:"City"}, 
        {id:6, content:"County"},
    ]
    return(
        <React.Fragment>
            <section className="section">
                <div className="toolbar">
                    <div className="toolbar-inner">
                        <div className="toolbar-inner-link">
                            <div><FontAwesomeIcon icon={faChevronLeft} style={{fontSize:'20px'}} /></div>
                            <div>Back</div>
                        </div>
                        <div className="toolbar-inner-title">Edit {title} form</div>
                        <div className="btn-group">
                            <Button className="grid-outlined-btn">Preview</Button>
                            <Button className="grid-filed-btn">Save</Button>
                        </div>
                    </div>
                </div>
            </section>
            <div className="left-sidebar">
                <div className="left-sidebar-inner">
                    <div className="left-sidebar-item">
                        <div className="left-sidebar-item-text">Add properties</div>
                        <FontAwesomeIcon icon={faChevronRight} style={{fontSize:'18px'}} />
                    </div>
                    <Divider/>
                    <div className="left-sidebar-item">
                        <div className="left-sidebar-item-text">Add conditional logic</div>
                        <FontAwesomeIcon icon={faChevronRight} style={{fontSize:'18px'}} />
                    </div>
                    <Divider/>
                    <div className="left-sidebar-item">
                        <div className="left-sidebar-item-text">Add associations </div>
                        <FontAwesomeIcon icon={faChevronRight} style={{fontSize:'18px'}} />
                    </div>
                </div>
            </div>
            <div className="form-section">
                <div className="form-section-inner">
                    <div className="modal-header-title">
                        Create {title}
                    </div>
                    <div className="form-section-body form"> 
                        <DraggableList list={JSON.parse(localStorage.getItem('branchOrder')) || list} />          
                                  
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}