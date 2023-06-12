import React, { useState, useEffect } from 'react';
import { Divider } from 'antd';
import { GridHeader } from '../../components/tablegrid/header';
import DataTable from '../../components/table';
import AddBranch from './addBranch';
import { useQuery } from '@apollo/client';
import { GET_BRANCHES } from '../../util/query/branch.query';

export const Branch = () =>{
    const [branchModal, setBranchModal] = useState(false);
    const { loading, error, data, refetch } = useQuery(GET_BRANCHES);

    return(
        <React.Fragment>
            <GridHeader title={"Branch(es)"} record={0} createAction={()=>setBranchModal(true)}/>
            <Divider/>
            <DataTable data={data} />
            <AddBranch visible={false || branchModal} refetch={refetch} onCancel={()=>setBranchModal(!branchModal)} />
        </React.Fragment>
    )
}