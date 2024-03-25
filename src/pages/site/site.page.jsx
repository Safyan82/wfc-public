import { GridHeader } from "@src/components/tablegrid/header";
import { TableGrid } from "@src/components/tablegrid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SiteGroupObjectQuery, getSiteGroups } from "../../util/query/siteGroup.query";
import { useMutation, useQuery } from "@apollo/client";
import { objectType } from "../../util/types/object.types";
import { useDispatch } from "react-redux";
import { AddSiteGroupMutation, UpdateBulkSiteGroupMutation } from "../../util/mutation/siteGroup.mutation";
import { setNotification } from "../../middleware/redux/reducers/notification.reducer";
import { SiteFormDrawer } from "./siteFormDrawer";
import { SiteObjectQuery, getSiteQuery, getSitesQuery } from "../../util/query/site.query";
import { AddSiteMutation, UpdateBulkSiteMutation } from "../../util/mutation/site.mutation";

export const SitePage = ()=>{
    
    const {editGridColumn} = useSelector(state => state.propertyReducer);
    const {data:siteObject, loading: siteObjectLoading, refetch: siteObjectRefetch} = useQuery(SiteObjectQuery);

    const [siteSchema, setSiteSchema] = useState();

    useEffect(()=>{
        if(siteObject){
          setSiteSchema(siteObject?.getSiteObject?.response);
        }
    },[siteObject]);

     // states that we had to define for formDrawer
    const [data, setData] = useState([]);
    const [isBtnEnable, setBtn] = useState(true);
    const [isoverlay, setIsOverlay] = useState(true);
    const [siteGroupModal, setSiteGroupModal] = useState(false);

    const dispatch = useDispatch();

    // Add new Employee while form creation
    const [addSiteMutation, {loading: processloading}] = useMutation(AddSiteMutation);
    const {data: siteData, loading: siteLoading, refetch} = useQuery(getSitesQuery,{fetchPolicy: 'cache-and-network',
        variables: {
            input: {
                filters: null
            }
        }
    });


    const siteGroupMutation = async (siteGroup) =>{
        try{
            await addSiteMutation({variables: {input: siteGroup}});
            await siteObjectRefetch();
            await refetch();

            dispatch(setNotification({
                notificationState:true, 
                message: "Site  was added successfully",
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
        const sitename = data?.find((d)=>(Object.keys(d)[0]=="sitename"));
        const postcode = data?.find((d)=>(Object.keys(d)[0]=="postcode"));
        const {sitegroup} = data?.find((d)=>(Object.keys(d)[0]=="sitegroup"));
        const contractstartdate = data?.find((d)=>(Object.keys(d)[0]=="contractstartdate"));
       
        let metadata = {};
        data?.map(d=>{
          if(Object.keys(d)[0]!=="sitename" && Object.keys(d)[0]!=="postcode" && Object.keys(d)[0]!=="sitegroup"  && Object.keys(d)[0]!=="contractstartdate" ){
            metadata[Object.keys(d)[0]]= Object.values(d)[0]
          }
        });
        const siteData = {
          ...sitename,
          ...postcode,
          ...contractstartdate,
          sitegroupId: sitegroup,
          metadata,
        }
        // handel mutation
        await siteGroupMutation(siteData);

        if(isCloseAble){
            setSiteGroupModal(!siteGroupModal);
        }

    };

    // dynamic column state for table gird
    const [dynamicColumn, setDynamicColumn] = useState([]);
    const [updateBulkSite, {loading: updateBulkSiteGroupLoading}] = useMutation(UpdateBulkSiteMutation);

    const handelBulkUpdateSave = async (property, record)=>{
        try{
            let schemaFields = {};
            
            
              if(property?.field==="sitename" || property?.field==="postcode" || property?.field==="sitegroupId" || property?.field==="contactstartdate" ){
                schemaFields[property?.field] = property?.value;
              }
              else{
                schemaFields['metadata.'+property.field]=property?.value;
              }
            
            await updateBulkSite({
                variables:{
                    input:{
                        _ids: [...record],
                        properties: {...schemaFields},
                    }
                }
            });
  
            dispatch(setNotification({
                message: "Site groups Updated Successfully",
                notificationState: true,
                error: false
            }));
            await refetch();
            return true;
        }
        catch(err){            
            dispatch(setNotification({
                message: "An error encountered while updating site group"+err.message,
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
            title={"Site"} 
            to={"/branch/editform"}
            record={siteData?.sites?.length} 
            from={"/user/branch"}      
            createAction={()=>{setSiteGroupModal(true);}} 
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
                title={"Site"}
                data={siteData?.sites?.map((sitegroup)=>({...sitegroup, key:sitegroup?._id}))}
                // refetch={refetch}
                setDynamicColumn={setDynamicColumn}
                dynamicColumn={dynamicColumn}
                viewRefetch={()=>{return false;}}
                view={false}
                loading={false}
                objectData={siteSchema}
                detailpage={"sitegroup-detail/"}
                handelBulkUpdateSave={handelBulkUpdateSave}

            />
        
        </div>

        <SiteFormDrawer
            objectData={siteSchema}
            objectLoading={siteObjectLoading}
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
            title={"Site"}
        />
       
        </React.Fragment>
    );
}