import '../../user.css';
import 'dayjs/locale/en-gb';
import { useQuery } from '@apollo/client';
import { GenericTable } from '../../../../components/genericTable/genericTable';
import { GetAllUserQuery } from '../../../../util/query/user.query';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { refetchAllUser } from '../../../../middleware/redux/reducers/user.reducer';
import { setEditUserData } from '../../../../middleware/redux/reducers/editUser.reducer';


export const UserTab = ({createUser, setUserRoleModal})=>{

  const dispatch = useDispatch();
    
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: 250,
          render:(_, record) => {
            return (
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems:'center'}}>
                <span>{record?.name}</span>
                {record?.key===hoveredRow?
                <button className={"grid-sm-btn"} 
                  onClick={()=>{
                    setUserRoleModal(true);
                    dispatch(setEditUserData(record));
                  }}
                  // style={showActions?{visibility: 'visible'}:{visibility: 'hidden'}} 
                  type="link" >
                  Edit
                </button>
                : null}
              </div>
            )
            
          }
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
    const {data, refetch} = useQuery(GetAllUserQuery, {
      fetchPolicy: 'network-only',
    });

    const [dataSource, setDataSource] = useState([]);

    const {refetchUser} = useSelector(state=>state.userDetailReducer);

    useEffect(()=>{
      if(refetchUser){
        refetch();
        dispatch(refetchAllUser(false));
      }
    }, [refetchUser]);

    useEffect(()=>{

      if(data?.getAllUser?.response){
        dayjs.locale('en-gb');
        const userData =  data?.getAllUser?.response?.map((user, index)=>({
          key: index,
          name: user?.employee[0]?.lastname+" "+user?.employee[0]?.firstname, 
          access: user?.userAccessType, 
          createdAt: 
          dayjs(user?.createdAt).format('DD/MM/YYYY HH:mm'),
          user: user 
        }));

        setDataSource(userData);
        
      }
    }, [data?.getAllUser?.response]);

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
            <div className='tableView userCreationTable site-layout'>
                <GenericTable 
                  hoveredRow={hoveredRow}
                  setHoveredRow={setHoveredRow}
                  handleRowMouseEnter={handleRowMouseEnter} 
                  dataSource={dataSource} column={columns}  
                  setSearchKeyword={setSearchKeyword} 
                />
            </div>

        </div>
    )
}