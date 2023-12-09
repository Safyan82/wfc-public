import { useQuery } from "@apollo/client";
import { Input, Select } from "antd";
import { GetEmployeeRecord } from "../../util/query/employee.query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CaretDownFilled } from "@ant-design/icons";

export const CreateUserComponent = ()=>{
    const {data: employeeData, loading: employeeDataLoading, refetch} = useQuery(GetEmployeeRecord ,{fetchPolicy: 'cache-and-network',
    variables: {
        input: {
            filters: null
        }
    }
    });

  console.log(employeeData?.getEmployee?.response);
    return(
        <div className="stepperBody createUser-block">
            <div className="createUser-block-header">
                <h3 className="h3">
                    Create new user from existing employees
                </h3>
                <div className="text">Add a new user to your workforce city account with an email address.</div>
            </div>
            
            <div>
                
                <Select
                    className="custom-select"
                    labelInValue
                    placeholder="Select Employee"
                    style={{width:'40%',margin:'auto', display:'table'}}
                    suffixIcon={<span className="dropdowncaret"></span>}
                >
                    {employeeData?.getEmployee?.response?.map((emp)=>(
                        <Select.Option value={emp?._id}>{emp?.firstname +" "+ emp?.lastname}</Select.Option>
                    ))}

                </Select>

                <hr className="create-form-hr"/>

                
                <div className="createUser-block-header">
                    <h3 className="h3 pt-20">
                        Or create multiple users at once.
                    </h3>
                    <div className="text">Create multiple users at once. Import their info from your integration app records.</div>
                </div>

                <div className="csv-box">
                    <div className="csv-btn">
                        
                    </div>
                </div>
            
            </div>

        </div>
    );
}