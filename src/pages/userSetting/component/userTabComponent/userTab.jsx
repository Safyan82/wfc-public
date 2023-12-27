import '../../user.css';
import 'dayjs/locale/en-gb';
import { useQuery } from '@apollo/client';
import { GenericTable } from '../../../../components/genericTable/genericTable';
import { GetAllUserQuery } from '../../../../util/query/user.query';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';


export const UserTab = ({createUser})=>{
    
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Access',
          dataIndex: 'access',
          key: 'access',
        },
        {
          title: 'Last Active',
          dataIndex: 'lastactive',
          key: 'lastactive',
        },
        {
          title: 'Created Date',
          dataIndex: 'createdAt',
          key: 'createdAt',
        },
    ];

    // access all user
    const {data} = useQuery(GetAllUserQuery, {
      fetchPolicy: 'network-only',
    });

    const [dataSource, setDataSource] = useState([]);

    useEffect(()=>{

      if(data?.getAllUser?.response){
        dayjs.locale('en-gb');
        const userData =  data?.getAllUser?.response?.map((user)=>({
          name: user?.employee[0]?.lastname+" "+user?.employee[0]?.firstname, 
          access: user?.userAccessType.split(/(?=[A-Z])/).join(",").replaceAll(",", " ").toLocaleUpperCase(), 
          createdAt: new dayjs(user?.createdAt).format('DD/MM/YYYY HH:mm') }));

        setDataSource(userData);
        
      }
    }, [data?.getAllUser?.response]);


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
                <GenericTable dataSource={dataSource} column={columns} />
            </div>

        </div>
    )
}