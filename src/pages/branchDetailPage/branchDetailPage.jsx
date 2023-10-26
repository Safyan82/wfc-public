import React, { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { DetailPageLeftSideBar } from './leftSideBar/leftSideBar';
import { DetailPageMiddleSection } from './middleSection/middleSection';
import { DetailPageRightSideBar } from './rightSideBar/rightSideBar';
import { useParams } from 'react-router-dom';
import { Notes } from './middleSection/notes/notes';
import { useSelector } from 'react-redux';
import { useQuery } from '@apollo/client';
import { getSingleBranch } from '../../util/query/branch.query';
import { useDispatch } from 'react-redux';
import { setSpecificBranchData } from '../../middleware/redux/reducers/branchData.reducer';

export const BranchDetailPage = ()=>{
    const param = useParams();
    const {noteToggle} = useSelector(state=>state.noteReducer);
    useEffect(()=>{
        console.log(noteToggle, "noteToggler");
    }, [noteToggle]);

    const {data: singleBranchData, loading: singleBranchLoading} = useQuery(getSingleBranch,{
        variables:{
            id: param?.id
        }
    });

    const dispatch = useDispatch();

    useEffect(()=>{
        if(!singleBranchLoading){
            dispatch(setSpecificBranchData(singleBranchData));
        }
    }, [singleBranchLoading]);

    return(
        <Row>
            {noteToggle?
            <Notes/>
            :null}

            <Col span={6} style={{paddingRight:'0px',
                maxHeight: 'calc(100vh - 54px)',
                overflowY: 'scroll'
            }}>
                <DetailPageLeftSideBar singleBranchData={singleBranchData}  />
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