import { GridHeader } from "@src/components/tablegrid/header";
import { TableGrid } from "@src/components/tablegrid";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMutation, useQuery } from "@apollo/client";
import { useDispatch } from "react-redux";
import { setNotification } from "../../middleware/redux/reducers/notification.reducer";
import { CustomerObjectQuery } from "@src/util/query/customer.query";
import { AddCustomerMutation, UpdateBulkCustomerMutation } from "../../util/mutation/customer.mutation";
import { getCustomerQuery } from "../../util/query/customer.query";
import { CustomerFormDrawer } from "./customerFormDrawer";
import { EditColumn } from "../../components/table/editColumn/editColumn.modal";

export const CustomerPage = ()=>{
    
    const {editGridColumn} = useSelector(state => state.propertyReducer);
    const {data:customerObject, loading: customerObjectLoading, refetch: customerObjectRefetch} = useQuery(CustomerObjectQuery);
    // customerObject?.getCustomerObject?.response
    
    const [customerSchema, setCustomerSchema] = useState();

    useEffect(()=>{
        if(customerObject){
            setCustomerSchema(customerObject?.getCustomerObject?.response);
        }
    },[customerObject]);

     // states that we had to define for formDrawer
    const [data, setData] = useState([]);
    const [isBtnEnable, setBtn] = useState(true);
    const [isoverlay, setIsOverlay] = useState(true);
    const [customerModal, setCustomerModal] = useState(false);

    const dispatch = useDispatch();

    // Add new Employee while form creation
    const [addCustomerMutation, {loading: processloading}] = useMutation(AddCustomerMutation);

    const {data: customerData, loading: customerLoading, refetch} = useQuery(getCustomerQuery,{fetchPolicy: 'cache-and-network',
        variables: {
            input: {
                filters: null
            }
        }
    });

    console.log(customerData, "customerDatacustomerData")

    const customerMutation = async (customer) =>{
        try{
            await addCustomerMutation({variables: {input: customer}});
            await customerObjectRefetch();
            await refetch();

            dispatch(setNotification({
                notificationState:true, 
                message: "Customer was added successfully",
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
        const customername = data?.find((d)=>(Object.keys(d)[0]=="customername"));
       
        let metadata = {};
        data?.map(d=>{
          if(Object.keys(d)[0]!=="customername"){
            metadata[Object.keys(d)[0]]= Object.values(d)[0]
          }
        });
        const customerData = {
          ...customername,
          metadata,
        }
        // handel mutation
        await customerMutation(customerData);

        if(isCloseAble){
            setCustomerModal(!customerModal);
        }

    };

    // dynamic column state for table gird
    const [dynamicColumn, setDynamicColumn] = useState([]);
    const [updateBulkCustomer, {loading: updateBulkCustomerLoading}] = useMutation(UpdateBulkCustomerMutation);

    const handelBulkUpdateSave = async (property, record)=>{
        try{
            let schemaFields = {};
            
            
              if(property?.field==="customername"){
                schemaFields[property?.field] = property?.value;
              }
              else{
                schemaFields['metadata.'+property.field]=property?.value;
              }
            
            await updateBulkCustomer({
                variables:{
                    input:{
                        _ids: [...record],
                        properties: {...schemaFields},
                    }
                }
            });
  
            dispatch(setNotification({
                message: "Customer Updated Successfully",
                notificationState: true,
                error: false
            }));
            await refetch();
            return true;
        }
        catch(err){            
            dispatch(setNotification({
                message: "An error encountered while updating Customer"+err.message,
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
            title={"Customers"} 
            to={"/branch/editform"}
            record={customerData?.customers?.length} 
            from={"/user/branch"}      
            createAction={()=>{setCustomerModal(true);}} 
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
                title={"Customer"}
                data={customerData?.customers?.map((customer)=>({...customer, key:customer?._id}))}
                // refetch={refetch}
                setDynamicColumn={setDynamicColumn}
                dynamicColumn={dynamicColumn}
                viewRefetch={()=>{return false;}}
                view={false}
                loading={false}
                objectData={customerSchema}
                detailpage={"customer-detail/"}
                handelBulkUpdateSave={handelBulkUpdateSave}
                noHeader={true}

            />
        
        </div>

        <CustomerFormDrawer
            objectData={customerSchema}
            objectLoading={customerObjectLoading}
            handelSubmit={handelSubmit}
            visible={false || customerModal} 
            refetch={refetch} 
            setBtn={setBtn}
            data={data}
            setData={setData}
            isBtnEnable={isBtnEnable}
            isoverlay={isoverlay}
            setIsOverlay={setIsOverlay}
            loading={processloading}
            onClose={()=>setCustomerModal(!customerModal)} 
            to={"/branch/editform"}
            from={"/user/branch"}
            title={"Customer"}
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