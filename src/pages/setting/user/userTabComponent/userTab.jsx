import { GenericTable } from '../../../../components/genericTable/genericTable';
import '../user.css';
export const UserTab = ()=>{
    return(
        <div className='userTab'>
            {/* descriptive text */}
            <div className="text">
                Create new users, customize user permissions, and remove users from your account.
            </div>

            {/* right btn */}
            <div className="create-btn">
                <button className="drawer-filled-btn">
                    Create User
                </button>
            </div>

            {/* table */}
            <div className='tableView site-layout'>
                <GenericTable/>
            </div>

        </div>
    )
}