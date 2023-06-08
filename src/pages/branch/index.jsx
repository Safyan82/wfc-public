import React, { useState } from 'react';
import axios from 'axios';
import { Divider } from 'antd';
import { GridHeader } from '../../components/tablegrid/header';
import DataTable from '../../components/table';
import AddBranch from './addBranch';

export const Branch = () =>{
    const [branchModal, setBranchModal] = useState(false);


    return(
        <React.Fragment>
            <GridHeader title={"Branch(es)"} record={0} createAction={()=>setBranchModal(true)}/>
            <Divider/>
            <DataTable />
            <AddBranch visible={false || branchModal} onCancel={()=>setBranchModal(!branchModal)} />
        </React.Fragment>
    )
}