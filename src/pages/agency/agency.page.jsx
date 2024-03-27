import { GridHeader } from "@src/components/tablegrid/header";
import { TableGrid } from "@src/components/tablegrid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { setNotification } from "../../middleware/redux/reducers/notification.reducer";
import { EditColumn } from "../../components/table/editColumn/editColumn.modal";
import { FormDrawer } from "../formDrawer";
import { AgencyObjectQuery, createAgencyMutation, getAgencies } from "../../util/query/agency.query";
import { UpdateBulkAgency } from "../../util/mutation/agency.mutation";
import { AgencyFormDrawer } from "./agencyFormDrawer";

export const AgencyPage = ()=>{
    
    const {editGridColumn} = useSelector(state => state.propertyReducer);
    const {data:agencyObject, loading: agencyObjectLoading, refetch: agencyObjectRefetch} = useQuery(AgencyObjectQuery);
 
    
    const [agencySchema, setAgencySchema] = useState();

    useEffect(()=>{
        if(agencyObject){
            setAgencySchema(agencyObject?.getAgencyObject?.response);
        }
    },[agencyObject]);

     // states that we had to define for formDrawer
    const [data, setData] = useState([]);
    const [isBtnEnable, setBtn] = useState(true);
    const [isoverlay, setIsOverlay] = useState(true);
    const [agencyModal, setAgencyModal] = useState(false);

    const dispatch = useDispatch();

    // Add new Employee while form creation
    const [addAgencyMutation, {loading: processloading}] = useMutation(createAgencyMutation);

    const {data: agencyData, loading: agencyLoading, refetch} = useQuery(getAgencies,{fetchPolicy: 'cache-and-network',
        variables: {
            input: {
                filters: null
            }
        }
    });


    const agencyMutation = async (agency) =>{
        try{
            await addAgencyMutation({variables: {input: agency}});
            await agencyObjectRefetch();
            await refetch();

            dispatch(setNotification({
                notificationState:true, 
                message: "Agency was added successfully",
                error: false,
            }));
            setData([]);
            setBtn(true);
            setIsOverlay(true);

        }catch(err){
            dispatch(setNotification({
                notificationState: true,
                error: true,
                message: err?.message
            }));
        }
    }

    const handelSubmit = async (isCloseAble)=>{
        const agencyname = data?.find((d)=>(Object.keys(d)[0]=="agencyname"));
       
        let metadata = {};
        data?.map(d=>{
          if(Object.keys(d)[0]!=="agencyname"){
            metadata[Object.keys(d)[0]]= Object.values(d)[0]
          }
        });
        
        const agencyData = {
          ...agencyname,
          metadata,
        }
        // handel mutation
        await agencyMutation(agencyData);

        if(isCloseAble){
            setAgencyModal(!agencyModal);
        }

    };

    // dynamic column state for table gird
    const [dynamicColumn, setDynamicColumn] = useState([]);
    const [updateBulkAgency, {loading: updateBulkAgencyLoading}] = useMutation(UpdateBulkAgency);

    const handelBulkUpdateSave = async (property, record)=>{
        try{
            let schemaFields = {};
            
            
              if(property?.field==="agencyname"){
                schemaFields[property?.field] = property?.value;
              }
              else{
                schemaFields['metadata.'+property.field]=property?.value;
              }
            
            await updateBulkAgency({
                variables:{
                    input:{
                        _ids: [...record],
                        properties: {...schemaFields},
                    }
                }
            });
  
            dispatch(setNotification({
                message: "Agencies Updated Successfully",
                notificationState: true,
                error: false
            }));
            await refetch();
            return true;
        }
        catch(err){            
            dispatch(setNotification({
                message: "An error encountered while updating agency"+err.message,
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
            title={"Agency"} 
            to={"/branch/editform"}
            record={agencyData?.agencies?.length} 
            from={"/user/branch"}      
            createAction={()=>{setAgencyModal(true);}} 
          />

          <div className="hr" style={{margin:'40px 50px', width:'auto'}}></div>
        
          {/* <DraggableTab  
            // viewList = {branchViewList?.branchViews}
            // loading = {branchViewListLoading}
            // refetch = {branchViewListRefetch}
            // updateView = {updateSelectedBranchView}
            // createView = {createBranchView}
            // createViewLoading = {createBranchViewLoading}
          /> */}

          {/* <GridFilter
            //   openAdvanceFilter={()=>setFilterModal(true)}
            //   updateView={upsertBranchView}
            //   refetch={refetchAll}
            //   viewList = {branchViewList?.branchViews}

          /> */}

          {/* <AdvanceFilter 
            // visible = {filterModal} 
            // onClose = {()=>setFilterModal(false)}
            // objectData = {branchObjectData?.getBranchProperty?.response}
            // object={"Branch"}
            // groupProperty = {BranchGroupProperty?.getPropertyByGroup?.data || []}
          /> */}
          
            <TableGrid
                title={"Agency"}
                data={agencyData?.agencies?.map((agency)=>({...agency, key:agency?._id}))}
                // refetch={refetch}
                setDynamicColumn={setDynamicColumn}
                dynamicColumn={dynamicColumn}
                viewRefetch={()=>{return false;}}
                view={false}
                loading={false}
                objectData={agencySchema}
                detailpage={"agency-detail/"}
                handelBulkUpdateSave={handelBulkUpdateSave}
                noHeader={true}

            />
        
        </div>

        <AgencyFormDrawer
            objectData={agencySchema}
            objectLoading={agencyObjectLoading}
            handelSubmit={handelSubmit}
            visible={false || agencyModal} 
            refetch={refetch} 
            setBtn={setBtn}
            data={data}
            setData={setData}
            isBtnEnable={isBtnEnable}
            isoverlay={isoverlay}
            setIsOverlay={setIsOverlay}
            loading={processloading}
            onClose={()=>setAgencyModal(!agencyModal)} 
            to={""}
            from={"/user/agency"}
            title={"Agency"}
        />
        
        {/* {editGridColumn?
            <EditColumn 
              objectType={objectType.Employee} 
              visible={editGridColumn} 
              onClose={()=>dispatch(setEditGridColumn(false))}
              properties = {employeeObject?.getEmployeeObject?.response}
              propertiesRefetch = {employeeObjectRefetch}
              loading = {employeeObjectLoading || employeeViewLoading}
              disable = {updateEmployeeViewLoading}
              refetchView = {viewRefetch}
              view = {employeeViewData?.employeeView?.response?.find((e)=>e._id==sessionStorage.getItem("selectedViewId"))?.viewFields}
              updateRenderedView = {updateEmployeeView}
            />
          : null
        } */}
       
        </React.Fragment>
    );
}