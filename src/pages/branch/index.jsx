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
import { CREATE_BRACNH, updateBulkBranchMutation } from '../../util/mutation/branch.mutation';
import { useDispatch } from 'react-redux';
import { setNotification } from '../../middleware/redux/reducers/notification.reducer';
import { BranchViewQuery, SingleBranchViewQuery } from '../../util/query/branchView.query';
import DraggableTab from '../../components/dragableTab';
import { GridFilter } from '../../components/tablegrid/gridFilter/gridFilter';
import { AdvanceFilter } from '../../components/advanceFilter/advanceFilter';
import { createBranchViewMutation, updateBranchView } from '../../util/mutation/branchView.mutation';
import { GetPropertyByGroupQuery } from '../../util/query/properties.query';
import { EditColumn } from '../../components/table/editColumn/editColumn.modal';
import { setEditGridColumn } from '../../middleware/redux/reducers/properties.reducer';
import { objectType } from '../../util/types/object.types';

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

    // reterive and store dynamic column for data table
    const [dynamicColumn, setDynamicColumn]=useState([]);

    const {data: SinglebranchView, loading: branchViewLoading, refetch: branchViewRefetch} = useQuery(SingleBranchViewQuery,{
      variables:{
        id: sessionStorage.getItem("selectedViewId") || ""
      },
      fetchPolicy: 'network-only',
      skip: !sessionStorage.getItem("selectedViewId")
    });

    // handel the event whenever the selected view will be change 
    // by triggering an event from the grid draggable tabs
    useEffect(()=>{
      if(sessionStorage.getItem("selectedViewId")){
        branchViewRefetch();
        refetch()
      }
    },[sessionStorage.getItem("selectedViewId")]);
    
    // get view list that we have had till now
    //  that can be docked or un-docked
    const {data: branchViewList , loading: branchViewListLoading, refetch: branchViewListRefetch } = useQuery(BranchViewQuery);

    // update view for dock and undock {pin, un-pin}
    const [updateSelectedBranchView] = useMutation(updateBranchView)
    

    // handel filter state
    const [filterModal, setFilterModal] = useState(false);

    // create new custom view for branch
    const[createBranchView, {loading: createBranchViewLoading}] = useMutation(createBranchViewMutation)


    // branch group property

    const {data: BranchGroupProperty} = useQuery(GetPropertyByGroupQuery,{
      variables:{
        objectType: "Branch"
      },
      fetchPolicy:'network-only'
    });

    // update branch view
    const [upsertBranchView] = useMutation(updateBranchView);
    const refetchAll = async ()=>{
      await branchViewListRefetch();
      await branchViewRefetch();
      await schemaRefetch();
      await refetch();
    }

    const {editGridColumn} = useSelector(state => state.propertyReducer);

    const [updateBranchCloumnView, {loading: updateBranchCloumnViewLoading}] = useMutation(updateBranchView);

    useEffect(()=>{
      refetchAll();
    },[]);

    // update Bulk data
    const [updateBulkBranch, {loading: updateBulkBranchLoading}] = useMutation(updateBulkBranchMutation)
    const handelBulkUpdateSave = async (property, record)=>{
      console.log(property, record, "new ");
      try{
          let schemaFields = {};
          
          
            if(property?.field==="branchname" || property?.field==="postcode"){
              schemaFields[property?.field] = property?.value;
            }
            else{
              schemaFields['metadata.'+property.field]=property?.value;
            }
          
          await updateBulkBranch({
              variables:{
                  input:{
                      _ids: [...record],
                      properties: {...schemaFields},
                  }
              }
          });

          dispatch(setNotification({
              message: "Branches Updated Successfully",
              notificationState: true,
              error: false
          }));
          await refetch();
          return true;
      }
      catch(err){            
          dispatch(setNotification({
              message: "An error encountered while updating branch",
              notificationState: true,
              error: true
          }));
          return false;
      }
    };

    return(
        <React.Fragment>

        <div className="tablegrid">
          <GridHeader 
            title={"Branch"} 
            refetch={refetchAll}
            record={branchData?.branches?.length} 
            to={"/branch/editform"}
            from={"/user/branch"}
      
            createAction={async()=>{setBranchModal(true);await schemaRefetch();}} 
          />
        
          <DraggableTab  
            viewList = {branchViewList?.branchViews}
            loading = {branchViewListLoading}
            refetch = {branchViewRefetch}
            updateView = {updateSelectedBranchView}
            createView = {createBranchView}
            createViewLoading = {createBranchViewLoading}
          />

          <GridFilter
              openAdvanceFilter={()=>setFilterModal(true)}
              updateView={upsertBranchView}
              refetch={refetchAll}
          />

          <AdvanceFilter 
            visible = {filterModal} 
            onClose = {()=>setFilterModal(false)}
            objectData = {branchObjectData?.getBranchProperty?.response}
            groupProperty = {BranchGroupProperty?.getPropertyByGroup?.data || []}
          />
          
          <TableGrid 
              data={branchData?.branches}
              loading={loading || branchObjectLoading || branchViewLoading  } 
              refetch={refetch}
              setDynamicColumn={setDynamicColumn}
              dynamicColumn={dynamicColumn}
              viewRefetch={branchViewRefetch}
              view = {SinglebranchView?.singlebranchView?.viewFields}
              objectData={branchObjectData?.getBranchProperty?.response}
              detailpage={"branch-detail/"}
              handelBulkUpdateSave={handelBulkUpdateSave}
          />
        
        </div>

        <FormDrawer
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
            onClose={()=>setBranchModal(!branchModal)} 
            to={"/branch/editform"}
            from={"/user/branch"}
            title={objectType.Branch}
        />
      {editGridColumn?
        <EditColumn 
          objectType={objectType.Branch} 
          visible={editGridColumn} 
          onClose={()=>dispatch(setEditGridColumn(false))}
          properties = {branchObjectData?.getBranchProperty?.response}
          propertiesRefetch = {schemaRefetch}
          loading = {branchObjectLoading || branchViewLoading}
          view = {SinglebranchView?.singlebranchView?.viewFields}
          updateRenderedView = {updateBranchCloumnView}
          disable = {updateBranchCloumnViewLoading}

          refetchView = {branchViewRefetch}
        />
        : null
      }    
            
        </React.Fragment>
    )
}