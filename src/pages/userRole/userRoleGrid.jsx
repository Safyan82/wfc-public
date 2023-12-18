import { GenericTable } from "../../components/genericTable/genericTable"

export const UserRoleGrid = ({column, createUser, dataSource})=>{
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
                column={column} />
            </div>

        </div>
    )
}