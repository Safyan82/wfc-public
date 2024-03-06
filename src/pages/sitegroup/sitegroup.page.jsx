import { GridHeader } from "@src/components/tablegrid/header";
import DraggableTab from "@src/components/dragableTab";
import { GridFilter } from "@src/components/tablegrid/gridFilter/gridFilter";
import { AdvanceFilter } from "@src/components/advanceFilter/advanceFilter";
import { TableGrid } from "@src/components/tablegrid";
import { FormDrawer } from "../formDrawer";
import { EditColumn } from "@src/components/table/editColumn/editColumn.modal";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SiteGroupObjectQuery, getSiteGroups } from "../../util/query/siteGroup.query";
import { useMutation, useQuery } from "@apollo/client";
import { objectType } from "../../util/types/object.types";
import { useDispatch } from "react-redux";
import { AddSiteGroupMutation } from "../../util/mutation/siteGroup.mutation";
import { setNotification } from "../../middleware/redux/reducers/notification.reducer";

export const SiteGroup = ()=>{
    
    const {editGridColumn} = useSelector(state => state.propertyReducer);
    const {data:siteGroupObject, loading: siteGroupObjectLoading, refetch: siteGroupObjectRefetch} = useQuery(SiteGroupObjectQuery);

    const [siteGroupSchema, setSiteGroupSchema] = useState();

    useEffect(()=>{
        if(!siteGroupObjectLoading){
            setSiteGroupSchema(siteGroupObject?.getSiteGroupObject?.response);
        }
    },[siteGroupObjectLoading]);

     // states that we had to define for formDrawer
    const [data, setData] = useState([]);
    const [isBtnEnable, setBtn] = useState(true);
    const [isoverlay, setIsOverlay] = useState(true);
    const [siteGroupModal, setSiteGroupModal] = useState(false);

    const dispatch = useDispatch();

    // Add new Employee while form creation
    const [addSiteGroupMutation, {loading: processloading}] = useMutation(AddSiteGroupMutation);
    const {data: siteGroupData, loading: siteGroupLoading, refetch} = useQuery(getSiteGroups,{fetchPolicy: 'cache-and-network',});

    const siteGroupMutation = async (siteGroup) =>{
        try{
            await addSiteGroupMutation({variables: {input: siteGroup}});
            await siteGroupObjectRefetch();
            await refetch();

            dispatch(setNotification({
                notificationState:true, 
                message: "Site group was added successfully",
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
        const sitegroupname = data?.find((d)=>(Object.keys(d)[0]=="sitegroupname"));
       
        let metadata = {};
        data?.map(d=>{
          if(Object.keys(d)[0]!=="sitegroupname"){
            metadata[Object.keys(d)[0]]= Object.values(d)[0]
          }
        });
        const siteGroupData = {
          ...sitegroupname,
          metadata,
        }
        // handel mutation
        await siteGroupMutation(siteGroupData);

        if(isCloseAble){
            setSiteGroupModal(!siteGroupModal);
        }

    };



    return(
        <React.Fragment>
            
        <div className="tablegrid">
          <GridHeader 
            title={"Site Groups"} 
            to={"/branch/editform"}
            record={siteGroupData?.sitegroups?.response?.length} 
            from={"/user/branch"}      
            createAction={async()=>{setSiteGroupModal(true);}} 
          />

          <div className="hr" style={{margin:'42px 42px'}}></div>
        
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
                title={"Site Group"}
                // data={employeeData?.getEmployee?.response}
                // refetch={refetch}
                // setDynamicColumn={setDynamicColumn}
                // dynamicColumn={dynamicColumn}
                // viewRefetch={viewRefetch}
                // view={employeeViewData?.employeeView?.response?.find((e)=>e._id==sessionStorage.getItem("selectedViewId"))?.viewFields || []}
                // loading={employeeDataLoading ||employeeDataLoading || employeeViewLoading}
                // objectData={employeeObject?.getEmployeeObject?.response}
                // detailpage={"employee-detail/"}
                // handelBulkUpdateSave={handelBulkUpdateSave}

            />
        
        </div>

        <FormDrawer
            objectData={siteGroupSchema}
            objectLoading={siteGroupObjectLoading}
            handelSubmit={handelSubmit}
            visible={false || siteGroupModal} 
            refetch={refetch} 
            setBtn={setBtn}
            data={data}
            setData={setData}
            isBtnEnable={isBtnEnable}
            isoverlay={isoverlay}
            setIsOverlay={setIsOverlay}
            loading={processloading}
            onClose={()=>setSiteGroupModal(!siteGroupModal)} 
            to={"/branch/editform"}
            from={"/user/branch"}
            title={"Site Group"}
        />
        {editGridColumn?
            <EditColumn 
            // objectType={objectType.Employee} 
            // visible={editGridColumn} 
            // onClose={()=>dispatch(setEditGridColumn(false))}
            // properties = {employeeObject?.getEmployeeObject?.response}
            // propertiesRefetch = {employeeObjectRefetch}
            // loading = {employeeObjectLoading || employeeViewLoading}
            // disable = {updateEmployeeViewLoading}
            // refetchView = {viewRefetch}
            // view = {employeeViewData?.employeeView?.response?.find((e)=>e._id==sessionStorage.getItem("selectedViewId"))?.viewFields}
            // updateRenderedView = {updateEmployeeView}
            
            />
            : null
        } 
        </React.Fragment>
    );
}