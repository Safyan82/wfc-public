import { useEffect, useState } from "react";
import { GenericTable } from "../../components/genericTable/genericTable"

export const UserRoleGrid = ({column, createUser, dataSource})=>{
    
    
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
                    hoveredRow={hoveredRow}
                    setHoveredRow={setHoveredRow}
                    handleRowMouseEnter={handleRowMouseEnter} 
                    setSearchKeyword={setSearchKeyword} 
                    
                />
            </div>

        </div>
    )
}