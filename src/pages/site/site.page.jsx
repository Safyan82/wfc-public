import { GridHeader } from "@src/components/tablegrid/header";
import DraggableTab from "@src/components/dragableTab";
import { GridFilter } from "@src/components/tablegrid/gridFilter/gridFilter";
import { AdvanceFilter } from "@src/components/advanceFilter/advanceFilter";
import { TableGrid } from "@src/components/tablegrid";
import { FormDrawer } from "../formDrawer";
import { EditColumn } from "@src/components/table/editColumn/editColumn.modal";
import React from "react";
import { useSelector } from "react-redux";

export const Site = ()=>{
    const {editGridColumn} = useSelector(state => state.propertyReducer);

    return(
        <React.Fragment>
            
        <div className="tablegrid">
          <GridHeader 
            title={"Site"} 
            // refetch={refetchAll}
            // record={branchData?.branches?.length} 
            to={"/branch/editform"}
            from={"/user/branch"}
      
            // createAction={async()=>{setBranchModal(true);await schemaRefetch();}} 
          />
        
          <DraggableTab  
            // viewList = {branchViewList?.branchViews}
            // loading = {branchViewListLoading}
            // refetch = {branchViewListRefetch}
            // updateView = {updateSelectedBranchView}
            // createView = {createBranchView}
            // createViewLoading = {createBranchViewLoading}
          />

          <GridFilter
            //   openAdvanceFilter={()=>setFilterModal(true)}
            //   updateView={upsertBranchView}
            //   refetch={refetchAll}
            //   viewList = {branchViewList?.branchViews}

          />

          <AdvanceFilter 
            // visible = {filterModal} 
            // onClose = {()=>setFilterModal(false)}
            // objectData = {branchObjectData?.getBranchProperty?.response}
            // object={"Branch"}
            // groupProperty = {BranchGroupProperty?.getPropertyByGroup?.data || []}
          />
          
          <TableGrid 
            //   data={branchData?.branches}
            //   loading={loading || branchObjectLoading || branchViewLoading  } 
            //   refetch={refetch}
            //   setDynamicColumn={setDynamicColumn}
            //   dynamicColumn={dynamicColumn}
            //   viewRefetch={branchViewRefetch}
            //   view = {SinglebranchView?.singlebranchView?.viewFields}
            //   objectData={branchObjectData?.getBranchProperty?.response}
            //   detailpage={"branch-detail/"}
            //   handelBulkUpdateSave={handelBulkUpdateSave}
          />
        
        </div>

        {/* <FormDrawer
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
        /> */}
        {editGridColumn?
            <EditColumn 
            // objectType={objectType.Branch} 
            // visible={editGridColumn} 
            // onClose={()=>dispatch(setEditGridColumn(false))}
            // properties = {branchObjectData?.getBranchProperty?.response}
            // propertiesRefetch = {schemaRefetch}
            // loading = {branchObjectLoading || branchViewLoading}
            // view = {SinglebranchView?.singlebranchView?.viewFields}
            // updateRenderedView = {updateBranchCloumnView}
            // disable = {updateBranchCloumnViewLoading}

            // refetchView = {branchViewRefetch}
            />
            : null
        } 
        </React.Fragment>
    );
}