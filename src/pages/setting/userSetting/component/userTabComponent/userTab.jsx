import '../../user.css';
import 'dayjs/locale/en-gb';
import { useMutation, useQuery } from '@apollo/client';
import { GenericTable } from '@src/components/genericTable/genericTable';
import { GetAllUserQuery } from '@src/util/query/user.query';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { refetchAllUser } from '@src/middleware/redux/reducers/user.reducer';
import { setEditUserData } from '@src/middleware/redux/reducers/editUser.reducer';
import { useNavigate } from 'react-router-dom';
import { deleteUserMutation } from '@src/util/mutation/deleteUser.mutation';


export const UserTab = ({createUser, setUserRoleModal})=>{

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: 250,
          render:(_, record) => {
            return (
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems:'center'}}>
                <span className='grid-hover' onClick={()=>navigate("/setting/user/"+record?.user?.employeeId)}>{record?.name}</span>
                {/* {record?.key===hoveredRow?
                <button className={"grid-sm-btn"} 
                  onClick={()=>{
                    setUserRoleModal(true);
                    dispatch(setEditUserData(record));
                  }}
                  // style={showActions?{visibility: 'visible'}:{visibility: 'hidden'}} 
                  type="link" >
                  Edit
                </button>
                : null} */}
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
          dataIndex: 'lastActive',
          key: 'lastActive',
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
          key: user?._id,
          name: user?.employee[0]?.lastname+" "+user?.employee[0]?.firstname, 
          access: user?.userAccessType, 
          lastActive: dayjs(user?.lastActive).format('DD/MM/YYYY HH:mm'),
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
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const handelUserEdit = ()=>{
      console.log(dataSource?.find((user)=>user?.key==selectedRowKeys[0]), "hogo")
      dispatch(setEditUserData(dataSource?.find((user)=>user?.key==selectedRowKeys[0])));
      setUserRoleModal(true);
    };

    const [userDeleteMutation] = useMutation(deleteUserMutation);

    const deleteUser = async () => {
      await userDeleteMutation({
        variables:{
          deleteUserId: selectedRowKeys[0]
        }
      });
     await refetch();
     setSelectedRowKeys([]);
    }

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
                  selectedRowKeys={selectedRowKeys}
                  setSelectedRowKeys={setSelectedRowKeys}
                  
                  tableOption={["Edit User", "Delete User"]}
                  tableOptionFunc={[handelUserEdit, deleteUser]}
                />
            </div>

        </div>
    )
}