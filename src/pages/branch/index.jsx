import React, { useState, useEffect } from 'react';
import { Divider } from 'antd';
import { GridHeader } from '../../components/tablegrid/header';
import DataTable from '../../components/table';
import { useQuery } from '@apollo/client';
import { GET_BRANCHES, GetBranchObject } from '../../util/query/branch.query';
import { FormDrawer } from '../formDrawer';
import { CreateFieldDrawer } from '../../components/createFields/index';

export const Branch = () =>{
    const [branchModal, setBranchModal] = useState(false);
    const [fieldModal, setFieldModal] = useState(false);
    const { loading, error, data, refetch } = useQuery(GET_BRANCHES);
    const {data:branchObjectData, loading: branchObjectLoading, refetch: schemaRefetch} = useQuery(GetBranchObject,{
        fetchPolicy:'network-only'
    });

    return(
        <React.Fragment>
            <GridHeader title={"Branch(es)"} record={0} editProperty={()=>setFieldModal(true)} createAction={async()=>{setBranchModal(true);await schemaRefetch();}}/>
            <Divider/>
            <DataTable 
                data={data}
                loading={loading} 
                refetch={refetch}
            />
            <FormDrawer
            branchObjectData={branchObjectData}
            branchObjectLoading={branchObjectLoading}
            visible={false || branchModal} refetch={refetch} onClose={()=>setBranchModal(!branchModal)} />
            
        </React.Fragment>
    )
}