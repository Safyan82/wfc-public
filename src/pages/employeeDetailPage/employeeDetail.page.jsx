import { Row, Col } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { DetailPageLeftSideBar } from './leftSideBar/leftSideBar';
import { DetailPageMiddleSection } from './middleSection/middleSection';
import { DetailPageRightSideBar } from './rightSideBar/rightSideBar';
import { useParams } from 'react-router-dom';
import { Notes } from './middleSection/notes/notes';
import { useSelector } from 'react-redux';
import { useMutation, useQuery } from '@apollo/client';
import { GetBranchObject, getSingleBranch } from '../../util/query/branch.query';
import { useDispatch } from 'react-redux';
import { setSpecificBranchData } from '../../middleware/redux/reducers/branchData.reducer';
import { BranchViewForSpecificUser } from '../../util/query/branchView.query';
import { updateBranchMutation } from '../../util/mutation/branch.mutation';
import { setNotification } from '../../middleware/redux/reducers/notification.reducer';
import { EmployeeObjectQuery, getSingleEmployeeRecord } from '../../util/query/employee.query';
import { Loader } from '../../components/loader';
import { updateEmployeeMutation } from '../../util/mutation/employee.mutation';
import Spinner from '../../components/spinner';


export const EmployeeDetailPage = ()=>{
    const param = useParams();
    const dispatch = useDispatch();

    const {noteToggle} = useSelector(state=>state.noteReducer);

    // get single employee Record
    const {data: singleEmployeeRecord, loading: singleEmployeeLoading, refetch: singleEmployeeRefetch} = useQuery(getSingleEmployeeRecord,{
        variables:{
            id: param?.id
        },
        fetchPolicy: 'network-only'
    });

    const [singleEmployee, setSingleEmployee] = useState([]);
    useEffect(()=>{
        if(!singleEmployeeLoading){
            setSingleEmployee(
                singleEmployeeRecord?.singleEmployee?.response
            );
        }
    },[singleEmployeeRecord]);

    // singleEmployee Record ended

    // Employee Default object
    const {data:employeeSchema, loading: employeeObjectLoading, refetch: employeeObjectRefetch} = useQuery(EmployeeObjectQuery,{fetchPolicy:'network-only'});
    const [employeeObject, setEmployeeObject] = useState([]);
    useEffect(()=>{
        if(!employeeObjectLoading){
            setEmployeeObject(employeeSchema?.getEmployeeObject?.response)  
        }
    },[employeeSchema]);
    // Employee default object terminated


    const [dataFields, setDataFields] = useState([]);
    
    const [refreshProp, setRefreshProp] = useState(false);
    

    const handelInputChange = ({name, value}) => {
        const isExist = dataFields?.find((field)=> field?.name == name);
        const property = employeeObject?.find((prop)=> prop.propertyDetail.label.replaceAll(" ","").toLowerCase() === name)
        // console.log(property, "branchProperties");
        setDataFields(isExist? dataFields?.map((field)=> {
            if(field.name == name){
                return {
                    name, value, propertyId: property?.propertyId,
                }
            }else{
                return field
            }
            
        }): [...dataFields, {name, value, propertyId: property?.propertyId}]);
    };

    const [updateEmployee, {loading, error}]  = useMutation(updateEmployeeMutation);

    const handelUpdateSave = async ()=>{
        try{
            let schemaFields = [];

            dataFields?.map((field)=>{
                if(field.name==="firstname" || field.name==="lastname"  || field.name==="branch"){
                    schemaFields.push(field);
                }
                else{
                    schemaFields.push({...field, metadata:1})
                }
            });

            await updateEmployee({
                variables:{
                    input:{
                        _id: param?.id,
                        properties: schemaFields,
                    }
                }
            });
            dispatch(setNotification({
                message: "Employee Details are Updated Successfully",
                notificationState: true,
                error: false
            }));

            await singleEmployeeRefetch();
            setRefreshProp(false);
            setDataFields([]);
        }
        catch(err){            
            dispatch(setNotification({
                message: "An error encountered while updating employee",
                notificationState: true,
                error: true
            }));
        }
    };

    console.log(employeeObject,"singleEmployee", singleEmployee)


    return(
        <>
            <Row>
                {noteToggle?
                <Notes/>
                :null}

                <Col span={6} style={{paddingRight:'0px',
                    maxHeight: 'calc(100vh - 54px)',
                    overflowY: 'scroll',
                    transition: 'scroll-behavior 1s',
                }}>
                    {singleEmployee?
                    <DetailPageLeftSideBar 
                        employeeObject={employeeObject?.map((object)=> ({_id: object.propertyId, ...object.propertyDetail}))}
                        singleEmployee={singleEmployee}
                        loading={employeeObjectLoading || singleEmployeeLoading}
                        handelInputChange={handelInputChange}
                    />:
                    <Loader/>
                    }
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
                <button className={loading? 'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} disabled={loading} onClick={handelUpdateSave}>{loading?<Spinner/>:"Save"}</button>
                <button className={loading? 'disabled-btn drawer-outlined-btn' : 'drawer-outlined-btn'}  disabled={loading} onClick={()=>{setDataFields([]);setRefreshProp(!refreshProp)}}>Cancel</button>
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