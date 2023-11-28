import React,{useEffect, useState} from "react";
import { TableGrid } from "../../components/tablegrid";
import { FormDrawer } from '../formDrawer';
import { useMutation, useQuery } from "@apollo/client";
import { EmployeeObjectQuery, GetEmployeeRecord } from "../../util/query/employee.query";
import { AddEmployeeMutation, updateBulkEmployeeMutation } from "../../util/mutation/employee.mutation";
import { useDispatch } from "react-redux";
import { setNotification } from "../../middleware/redux/reducers/notification.reducer";
import { employeeViewQuery } from "../../util/query/employeeView.query";
import { useSelector } from "react-redux";
import { GridHeader } from "../../components/tablegrid/header";
import DraggableTab from "../../components/dragableTab";
import { GridFilter } from "../../components/tablegrid/gridFilter/gridFilter";
import { AdvanceFilter } from "../../components/advanceFilter/advanceFilter";
import { UpdateEmployeeViewMutation, newEmployeeViewMutation } from "../../util/mutation/employeeView.mutation";
import { GetPropertyByGroupQuery } from "../../util/query/properties.query";
import { EditColumn } from "../../components/table/editColumn/editColumn.modal";
import { objectType } from "../../util/types/object.types";
import { setEditGridColumn } from "../../middleware/redux/reducers/properties.reducer";

export const Employee = () =>{
    const [employeeModal, setEmployeeModal] = useState(false);
    const [employeeSchema, setEmployeeSchema] = useState();
    // states that we had to define for formDrawer
    const [data, setData] = useState([]);
    const [isBtnEnable, setBtn] = useState(true);
    const [isoverlay, setIsOverlay] = useState(true);
    // states terminated here that we had to define for formDrawer

    // here the quick and advance filters that we reterive from the selected view
    const {quickFilter, advanceFilter} = useSelector(state=>state.quickFilterReducer);

    const {data: employeeData, loading: employeeDataLoading, refetch} = useQuery(GetEmployeeRecord,{fetchPolicy: 'cache-and-network',
      variables: {
          input: {
              filters: quickFilter && Object.values(quickFilter)?.length>0 && advanceFilter?.length>0 ? 
              {quickFilter, advanceFilter: [...advanceFilter]} :
              quickFilter && Object.values(quickFilter)?.length>0 ? {quickFilter} : 
              advanceFilter?.length>0 ? {advanceFilter: [...advanceFilter]} : null
          }
      }
    });
  
    // Reteriving employeeSchema Object
    const {data:employeeObject, loading: employeeObjectLoading, refetch: employeeObjectRefetch} = useQuery(EmployeeObjectQuery);
   

    useEffect(()=>{
        if(!employeeObjectLoading){
            setEmployeeSchema(employeeObject?.getEmployeeObject?.response);
        }
    },[employeeObjectLoading]);


    const handelSubmit=async (isCloseAble)=>{
        const firstname = data?.find((d)=>(Object.keys(d)[0]=="firstname"));
        const lastname = data?.find((d)=>(Object.keys(d)[0]==="lastname"));
        const branch = data?.find((d)=>(Object.keys(d)[0]==="branch"));
        
        let metadata = {};
        data?.map(d=>{
          if(Object.keys(d)[0]!=="firstname" && Object.keys(d)[0]!=="lastname" && Object.keys(d)[0]!=="branch"){
            metadata[Object.keys(d)[0]]= Object.values(d)[0]
          }
        });
        const employee = {
          ...firstname,
          ...lastname,
          ...branch,
          metadata,
        }
        // handel mutation
        await employeeMutation(employee);

        if(isCloseAble){
            setEmployeeModal(!employeeModal);
        }

    }


    const dispatch = useDispatch();

    // Add new Employee while form creation
    const [addEmployeeMutation, {loading: processloading}] = useMutation(AddEmployeeMutation);

    const employeeMutation=async (employee)=>{
        try{
          await addEmployeeMutation({variables: {input: employee}});
          await viewRefetch();
          await refetch();
          await employeeObjectRefetch();
          dispatch(setNotification({
            notificationState:true, 
            message: "Employee was added successfully",
            error: false,
          }));
          setData([]);
          setBtn(true);
          setIsOverlay(true);

        }
        catch(err){
          dispatch(setNotification({
              message: err?.message,
              error: true,
              notificationState: true
            }));
          
        }
    }

    // dynamic column state for table gird
    const [dynamicColumn, setDynamicColumn] = useState([]);

    // view name and their filters will be there
    const {data: employeeViewData, loading: employeeViewLoading, refetch: viewRefetch} = useQuery(employeeViewQuery);
    // filter control sate
    
    const [filterModal, setFilterModal] = useState(false);

    // create new customized view for employee
    const [newEmployeeView, {loading: newEmployeeViewLoading}] = useMutation(newEmployeeViewMutation);
    const [updateEmployeeView, {loading: updateEmployeeViewLoading}] = useMutation(UpdateEmployeeViewMutation)
    
    
    // employee group property

    const {data: EmployeeGroupProperty} = useQuery(GetPropertyByGroupQuery,{
      variables:{
        objectType: "Employee"
      },
      fetchPolicy:'network-only'
    });
    

    // updateView 
    const [upsertEmployeeView] = useMutation(UpdateEmployeeViewMutation);

     // handel the event whenever the selected view will be change 
    // by triggering an event from the grid draggable tabs
    useEffect(()=>{
      if(sessionStorage.getItem("selectedViewId")){
        viewRefetch();
        refetch()
      }
    },[sessionStorage.getItem("selectedViewId")]);

    const {editGridColumn} = useSelector(state => state.propertyReducer);
    
    useEffect(()=>{
      
      viewRefetch();
      refetch();
      employeeObjectRefetch();
      
    },[]);

    // update Bulk data
    const [updateBulkEmployee] = useMutation(updateBulkEmployeeMutation)
    const handelBulkUpdateSave = async (property, record)=>{
      console.log(property, record, "new ");
      try{
          let schemaFields = {};
          
          
            if(property?.field==="firstname" || property?.field==="lastname" || property?.field==="branch"){
              schemaFields[property?.field] = property?.value;
            }
            else{
              schemaFields['metadata.'+property.field]=property?.value;
            }
          
          await updateBulkEmployee({
              variables:{
                  input:{
                      _ids: [...record],
                      properties: {...schemaFields},
                  }
              }
          });

          dispatch(setNotification({
              message: "Employees Updated Successfully",
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
              title={"Employee"}
              to={"/employee/editform"}
              from={"/user/employee"}
              record={employeeData?.getEmployee?.response?.length} 
              createAction={()=>setEmployeeModal(!employeeModal)} 
            />
          
            <DraggableTab             
              viewList = {employeeViewData?.employeeView?.response}
              loading = {employeeViewLoading}
              refetch = {viewRefetch}
              updateView = {updateEmployeeView}
              createView={newEmployeeView}
              createViewLoading={newEmployeeViewLoading}
            />

            <GridFilter
                openAdvanceFilter={()=>setFilterModal(true)}
                updateView={upsertEmployeeView}
                
                refetch= {async()=>{
                  await viewRefetch();
                  await refetch();
                  await employeeObjectRefetch();
                }}
            />

            <AdvanceFilter 
              visible= {filterModal} 
              onClose= {()=>setFilterModal(false)}
              objectData= {employeeObject?.getEmployeeObject?.response}
              groupProperty= {EmployeeGroupProperty?.getPropertyByGroup?.data || []}
            />
            
            <TableGrid
                title={"Employee"}
                data={employeeData?.getEmployee?.response}
                refetch={refetch}
                setDynamicColumn={setDynamicColumn}
                dynamicColumn={dynamicColumn}
                viewRefetch={viewRefetch}
                view={employeeViewData?.employeeView?.response?.find((e)=>e._id==sessionStorage.getItem("selectedViewId"))?.viewFields || []}
                loading={employeeDataLoading ||employeeDataLoading || employeeViewLoading}
                objectData={employeeObject?.getEmployeeObject?.response}
                detailpage={"employee-detail/"}
                handelBulkUpdateSave={handelBulkUpdateSave}

            />
          </div>


            <FormDrawer
               objectData={employeeSchema}
               objectLoading={employeeObjectLoading}
               visible={employeeModal} 
               refetch={refetch} 
               setBtn={setBtn}
               setData={setData}
               data={data}
               isBtnEnable={isBtnEnable}
               isoverlay={isoverlay}
               setIsOverlay={setIsOverlay}
               loading={processloading}
               onClose={()=>setEmployeeModal(!employeeModal)} 
               handelSubmit={handelSubmit}
               to={"/employee/editform"}
               from={"/user/employee"}
               title={objectType.Employee}
            />
          {editGridColumn?
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
          }

        </React.Fragment>
    )
}