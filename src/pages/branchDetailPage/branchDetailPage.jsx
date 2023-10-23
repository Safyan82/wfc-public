import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { DetailPageLeftSideBar } from './leftSideBar/leftSideBar';
import { DetailPageMiddleSection } from './middleSection/middleSection';
import { DetailPageRightSideBar } from './rightSideBar/rightSideBar';
import { useParams } from 'react-router-dom';
import { Notes } from './middleSection/notes/notes';
import { useSelector } from 'react-redux';

export const BranchDetailPage = ()=>{
    const param = useParams();
    const {noteToggle} = useSelector(state=>state.noteReducer);
    useEffect(()=>{
        console.log(noteToggle, "noteToggler");
    }, [noteToggle]);
    return(
        <Row>
            {noteToggle?
            <Notes/>
            :null}

            <Col span={6} style={{paddingRight:'0px',
                maxHeight: 'calc(100vh - 54px)',
                overflowY: 'scroll'
            }}>
                <DetailPageLeftSideBar id={param?.id}  />
            </Col>
            <Col span={12} style={{paddingLeft:'0px'}} >
                <DetailPageMiddleSection  />
            </Col>
            <Col span={6}>
                <DetailPageRightSideBar  />
            </Col>
        </Row>
    );
}