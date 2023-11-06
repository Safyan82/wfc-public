import { Row, Col } from 'antd';
import './branchDetailPage.css';
import React, { useEffect, useRef, useState } from 'react';
import { DetailPageLeftSideBar } from './leftSideBar/leftSideBar';
import { DetailPageMiddleSection } from './middleSection/middleSection';
import { DetailPageRightSideBar } from './rightSideBar/rightSideBar';
import { useParams } from 'react-router-dom';
import { Notes } from './middleSection/notes/notes';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { getSingleBranch } from '../../util/query/branch.query';
import { useDispatch } from 'react-redux';
import { setSpecificBranchData } from '../../middleware/redux/reducers/branchData.reducer';
import { BranchViewForSpecificUser } from '../../util/query/branchView.query';
import { updateBranchMutation } from '../../util/mutation/branch.mutation';
import { setNotification } from '../../middleware/redux/reducers/notification.reducer';


export const BranchDetailPage = ()=>{
    const param = useParams();
    const {noteToggle} = useSelector(state=>state.noteReducer);

    const {data: singleBranchData, loading: singleBranchLoading, refetch: singleBranchRefetch} = useQuery(getSingleBranch,{
        variables:{
            id: param?.id
        },
        fetchPolicy: 'network-only'
    });

    const dispatch = useDispatch();

    useEffect(()=>{
        if(!singleBranchLoading){
            dispatch(setSpecificBranchData({id: param?.id, ...singleBranchData}));
        }
    }, [singleBranchLoading]);

    const [dataFields, setDataFields] = useState([]);
    const [handelCancelRequestUndoValueFlag, sethandelCancelRequestUndoValueFlag] = useState(false);

    useEffect(()=>{
        if(handelCancelRequestUndoValueFlag==true){
            singleBranchRefetch();
        }
    },[handelCancelRequestUndoValueFlag]);
    
    const [refreshProp, setRefreshProp] = useState(false);
    
    useEffect(()=>{
        window.scrollTo(0, document.body.scrollHeight);
    }, [dataFields]);
    
    const [phone, setPhone] = useState([]);
    
    

    const handelInputChange = (target) => {
        const {name, value} = target;
        const isExist = dataFields?.find((field)=> field?.name == name);
        setDataFields(isExist? dataFields?.map((field)=> {
            if(field.name == name){
                return {
                    name, value
                }
            }else{
                return field
            }
            
        }): [...dataFields, {name, value}]);
    };

    const [updateBranch, {loading, error}]  = useMutation(updateBranchMutation);

    const handelUpdateSave = async ()=>{
        try{
            let schemaFields = [];

            dataFields?.map((field)=>{
                if(field.name==="branchname" || field.name==="postcode"){
                    schemaFields.push(field);
                }
                else{
                    schemaFields.push({...field, metadata:1})
                }
            });

            await updateBranch({
                variables:{
                    input:{
                        _id: param?.id,
                        properties: schemaFields,
                    }
                }
            });

            dispatch(setNotification({
                message: "Branch Updated Successfully",
                notificationState: true,
                error: false
            }));
            await singleBranchRefetch();
            setRefreshProp(false);
            setDataFields([]);
        }
        catch(err){            
            dispatch(setNotification({
                message: "An error encountered while updating branch",
                notificationState: true,
                error: true
            }));
        }
    };

    const leftSideRef = useRef();

    const handelScrollbar = ()=>{
        const element = leftSideRef.current;
        const duration = 2000; // Adjust the duration (in milliseconds) as needed

        const startScrollTop = element.scrollTop;
        const targetScrollTop = element.scrollHeight;

        const startTime = performance.now();

        function scroll(timestamp) {
            const currentTime = timestamp - startTime;
            if (currentTime < duration) {
                const scrollPosition = easeInOutQuad(currentTime, startScrollTop, targetScrollTop - startScrollTop, duration);
                element.scrollTop = scrollPosition;
                requestAnimationFrame(scroll);
            } else {
                element.scrollTop = targetScrollTop; // Ensure exact target position at the end
            }
        }

        requestAnimationFrame(scroll);

    };

    const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    return(
        <>
            <Row>
                {noteToggle?
                <Notes/>
                :null}

                <Col span={6} ref={leftSideRef} style={{paddingRight:'0px',
                    maxHeight: 'calc(100vh - 54px)',
                    overflowY: 'scroll',
                    transition: 'scroll-behavior 1s',
                }}>
                    <DetailPageLeftSideBar 
                        handelCancelRequestUndoValueFlag={handelCancelRequestUndoValueFlag} 
                        handelInputChange={handelInputChange} 
                        branchId={param?.id} 
                        singleBranchData={singleBranchData} 
                        key={refreshProp}
                        dataFields={dataFields}
                        handelScrollbar={handelScrollbar}
                    />

                </Col>
                <Col span={12} style={{paddingLeft:'0px'}} >
                    <DetailPageMiddleSection  />
                </Col>
                <Col span={6}>
                    <DetailPageRightSideBar  />
                </Col>
            </Row>
            {dataFields?.length>0 ?
            <div className='action-footer'>
                <button className='drawer-filled-btn' onClick={handelUpdateSave}>Save</button>
                <button className='drawer-outlined-btn' onClick={()=>{setDataFields([]);setRefreshProp(!refreshProp)}}>Cancel</button>
                {
                    dataFields?.length?
                    <span className='text' style={{margin: 0}}>You've changed {dataFields?.length} properties</span>
                    : null
                }
            </div>
            : null}
        </>
        
    );
}