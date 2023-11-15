import React,{useEffect, useState} from "react";
import { TableGrid } from "../../components/tablegrid";
import { FormDrawer } from '../formDrawer';
import { Grid } from "./component/GenericTableGrid";
import { useMutation, useQuery } from "@apollo/client";
import { EmployeeObjectQuery, GetEmployeeRecord } from "../../util/query/employee.query";
import { AddEmployeeMutation } from "../../util/mutation/employee.mutation";
import { useDispatch } from "react-redux";
import { setNotification } from "../../middleware/redux/reducers/notification.reducer";

export const Employee = () =>{
    const [employeeModal, setEmployeeModal] = useState(false);
    const [employeeSchema, setEmployeeSchema] = useState();
    // states that we had to define for formDrawer
    const [data, setData] = useState([]);
    const [isBtnEnable, setBtn] = useState(true);
    const [isoverlay, setIsOverlay] = useState(true);
    // states terminated here that we had to define for formDrawer

    const {data: employeeData, loading: employeeDataLoading, refetch} = useQuery(GetEmployeeRecord)
  
    // Reteriving employeeSchema Object
    const {data:employeeObject, loading: employeeObjectLoading} = useQuery(EmployeeObjectQuery);
   

    useEffect(()=>{
        if(!employeeObjectLoading){
            setEmployeeSchema(employeeObject?.getEmployeeObject?.response);
        }
    },[employeeObjectLoading]);


    const handelSubmit=async (isCloseAble)=>{
        const firstname = data?.find((d)=>(Object.keys(d)[0]=="firstname"));
        const lastname = data?.find((d)=>(Object.keys(d)[0]==="lastname"));
        
        let metadata = {};
        data?.map(d=>{
          if(Object.keys(d)[0]!=="firstname" && Object.keys(d)[0]!=="lastname"){
            metadata[Object.keys(d)[0]]= Object.values(d)[0]
          }
        });
        const employee = {
          ...firstname,
          ...lastname,
          branchid: '123',
          metadata,
        }
        // handel mutation
        await employeeMutation(employee);

        if(isCloseAble){
            setEmployeeModal(!employeeModal);
        }

    }


    const dispatch = useDispatch();
    const [addEmployeeMutation, {loading: processloading}] = useMutation(AddEmployeeMutation);

    const employeeMutation=async (employee)=>{
        try{
          await addEmployeeMutation({variables: {input: employee}});
          dispatch(setNotification({
            notificationState:true, 
            message: "Branch was added successfully",
            error: false,
          }))
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

    return(
        <React.Fragment>
            
            <Grid
                title={"Employee"}
                createAction={()=>setEmployeeModal(!employeeModal)}
                data={employeeData?.getEmployee?.response}
                refetch={refetch}
                loading={employeeDataLoading}
            />
            <FormDrawer
               title={"Employee"}
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
            />
        
        </React.Fragment>
    )
}