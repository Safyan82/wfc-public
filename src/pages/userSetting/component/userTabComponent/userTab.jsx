import { GenericTable } from '../../../../components/genericTable/genericTable';
import '../../user.css';
export const UserTab = ({createUser})=>{
    
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Access',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Last Active',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Created Date',
          dataIndex: 'name',
          key: 'name',
        },
    ];

    return(
        <div className='userTab'>
            {/* descriptive text */}
            <div className="text">
                Create new users, customize user permissions, and remove users from your account.
            </div>

            {/* right btn */}
            <div className="create-btn">
                <button className="drawer-filled-btn" onClick={createUser}>
                    Create User
                </button>
            </div>

            {/* table */}
            <div className='tableView site-layout'>
                <GenericTable column={columns} />
            </div>

        </div>
    )
}