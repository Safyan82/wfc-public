import React, { useState, useEffect } from 'react';
import { Divider } from 'antd';
import { GridHeader } from '../../components/tablegrid/header';
import {DataTable} from '../../components/table';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BRANCHES, GetBranchObject } from '../../util/query/branch.query';
import { FormDrawer } from '../formDrawer';
import { CreateFieldDrawer } from '../../components/createFields/index';
import { TableGrid } from '../../components/tablegrid';
import { useSelector } from 'react-redux';
import { CREATE_BRACNH } from '../../util/mutation/branch.mutation';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../middleware/redux/reducers/notification.reducer';

export const Branch = () =>{
    const [branchModal, setBranchModal] = useState(false);
    const [fieldModal, setFieldModal] = useState(false);

    // states that we had to define for formDrawer
    const [data, setData] = useState([]);
    const [isBtnEnable, setBtn] = useState(true);
    const [isoverlay, setIsOverlay] = useState(true);
    // states terminated here that we had to define for formDrawer

    const {quickFilter, advanceFilter} = useSelector(state=>state.quickFilterReducer);


    const { loading, error, data: branchData, refetch } = useQuery(GET_BRANCHES,{
        fetchPolicy: 'cache-and-network',
        variables: {
            input: {
                filters: quickFilter && Object.values(quickFilter)?.length>0 && advanceFilter?.length>0 ? 
                {quickFilter, advanceFilter: [...advanceFilter]} :
                quickFilter && Object.values(quickFilter)?.length>0 ? {quickFilter} : 
                advanceFilter?.length>0 ? {advanceFilter: [...advanceFilter]} : null
            }
        }
    });

    

    const {data:branchObjectData, loading: branchObjectLoading, refetch: schemaRefetch} = useQuery(GetBranchObject,{
        fetchPolicy:'cache-and-network'
    });

    const [createBranch, { loading:processLoading }] = useMutation(CREATE_BRACNH);

    const handelSubmit=async (isCloseAble)=>{
        const branchName = data?.find((d)=>(Object.keys(d)[0]=="branchname"));
        const postcode = data?.find((d)=>(Object.keys(d)[0]==="postcode"));
        
        let metadata = {};
        data?.map(d=>{
          if(Object.keys(d)[0]!=="postcode" && Object.keys(d)[0]!=="branchname"){
            metadata[Object.keys(d)[0]]= Object.values(d)[0]
          }
        });
        const branch = {
          ...branchName,
          ...postcode,
          metadata,
        }
        // handel mutation
        await branchMutation(branch);

        if(isCloseAble){
            setBranchModal(!branchModal);
        }

    }


    const dispatch = useDispatch();
    const branchMutation=async (branch)=>{
        try{
          await createBranch({variables: {input: branch}});
          dispatch(setNotification({
            notificationState:true, 
            message: "Branch was added successfully",
            error: false,
          }))
          setData([]);
          setBtn(true);
          setIsOverlay(true);
          await refetch();
    
        }
        catch(err){
          dispatch(setNotification({
              message: error?.message,
              error: true,
              notificationState: true
            }));
          
        }
    }

    return(
        <React.Fragment>
            {/* <GridHeader title={"Branch(es)"} record={0} editProperty={()=>setFieldModal(true)} createAction={async()=>{setBranchModal(true);await schemaRefetch();}}/> */}
            {/* <Divider/> */}
            <TableGrid 
                data={branchData}
                loading={loading} 
                refetch={refetch}
                createAction={async()=>{setBranchModal(true);await schemaRefetch();}}
            />
            <FormDrawer
                title="Branch"
                objectData={branchObjectData?.getBranchProperty?.response}
                objectLoading={branchObjectLoading}
                handelSubmit={handelSubmit}
                visible={false || branchModal} 
                refetch={refetch} 
                setBtn={setBtn}
                data={data}
                setData={setData}
                isBtnEnable={isBtnEnable}
                isoverlay={isoverlay}
                setIsOverlay={setIsOverlay}
                loading={processLoading}
                onClose={()=>setBranchModal(!branchModal)} />
            
        </React.Fragment>
    )
}