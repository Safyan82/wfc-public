import React, { useState, useEffect } from 'react';
import { Divider } from 'antd';
import { GridHeader } from '../../components/tablegrid/header';
import {DataTable} from '../../components/table';
import { useQuery } from '@apollo/client';
import { GET_BRANCHES, GetBranchObject } from '../../util/query/branch.query';
import { FormDrawer } from '../formDrawer';
import { CreateFieldDrawer } from '../../components/createFields/index';
import { TableGrid } from '../../components/tablegrid';
import { useSelector } from 'react-redux';

export const Branch = () =>{
    const [branchModal, setBranchModal] = useState(false);
    const [fieldModal, setFieldModal] = useState(false);
    
    const {quickFilter, advanceFilter} = useSelector(state=>state.quickFilterReducer);

    useEffect(()=>{
        console.log(advanceFilter, "advanceFilter");
    }, [advanceFilter]);

    const { loading, error, data: branchData, refetch } = useQuery(GET_BRANCHES,{
        fetchPolicy: 'network-only',
        variables: {
            input: {
                filters: Object.values(quickFilter)?.length>0 && advanceFilter?.length>0 ? 
                {quickFilter, advanceFilter: [...advanceFilter]} :
                Object.values(quickFilter)?.length>0 ? {quickFilter} : 
                advanceFilter?.length>0 ? {advanceFilter: [...advanceFilter]} : null
            }
        }
    });

    

    const {data:branchObjectData, loading: branchObjectLoading, refetch: schemaRefetch} = useQuery(GetBranchObject,{
        fetchPolicy:'network-only'
    });



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
            branchObjectData={branchObjectData}
            branchObjectLoading={branchObjectLoading}
            visible={false || branchModal} refetch={refetch} onClose={()=>setBranchModal(!branchModal)} />
            
        </React.Fragment>
    )
}