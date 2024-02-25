import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { GenericTable } from "../../../components/genericTable/genericTable"
import { setUserRoleToBeEdit } from "../../../middleware/redux/reducers/userRole.reducer";

export const UserRoleGrid = ({column, createUser, dataSource, rawData})=>{
    
    
    const [searchKeyword, setSearchKeyword] = useState("");

    useEffect(()=>{
      if(searchKeyword?.length>0){
        console.log(searchKeyword, "s")
      }
    },[searchKeyword]);

    const handleRowMouseEnter = (record) => {
      setHoveredRow(record.key);
      sessionStorage.setItem('RolehoverItem', record.key);
    };
    const [hoveredRow, setHoveredRow] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(()=>{
        console.log(selectedRowKeys, "roww keyyy");
    }, [selectedRowKeys]);

    const dispatch = useDispatch();
    
    const handelRoleEdit = ()=>{
        const editProp = rawData?.find((data)=>data?._id==selectedRowKeys[0]);
        dispatch(setUserRoleToBeEdit(editProp));
        createUser();
    };
    
    return(
        <div className='userTab'>

            {/* right btn */}
            <div className="create-btn">
                <button className="drawer-filled-btn" onClick={createUser}>
                    Create User Role
                </button>
            </div>

            {/* table */}
            <div className='tableView site-layout'>
                <GenericTable 
                    dataSource={dataSource} 
                    column={column} 
                    tableOption={["Edit Role"]}
                    tableOptionFunc={[handelRoleEdit]}
                    hoveredRow={hoveredRow}
                    setHoveredRow={setHoveredRow}
                    handleRowMouseEnter={handleRowMouseEnter} 
                    setSearchKeyword={setSearchKeyword}   
                    selectedRowKeys={selectedRowKeys}
                    setSelectedRowKeys={setSelectedRowKeys}
                />
            </div>

        </div>
    )
}