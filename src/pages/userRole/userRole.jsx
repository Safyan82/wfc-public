import { Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { CreateUserRoleModal } from './userRole.modal';
import { UserRoleGrid } from './userRoleGrid';
import "./userRole.css";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useQuery } from '@apollo/client';
import { UserRoleQuery } from '../../util/query/userRole.query';

export const UserRole = ()=>{
    const [userModal, setUserModal] = useState(false);
    const column = [
        {
            title: 'NAME',
            key: 'rolename',
            dataIndex: 'rolename'
        }, 
        {
            title: 'Permission',
            key: 'permission',
            dataIndex: 'permission'
        }, 
        {
            title: 'Created At',
            key: 'createdat',
            dataIndex: 'createdAt'
        }, 

    ];

    const {data} = useQuery(UserRoleQuery,{
        fetchPolicy: 'network-only'
    });
    const [userRoleData, setUserRoleData] = useState([]);
    useEffect(()=>{
        if(data?.userRoleList?.response){
            setUserRoleData(data?.userRoleList?.response?.map((role)=>({
                ...role,
                permission:Object.keys(role.permission)?.map((access)=>
                <>
                    <span>
                        <b>{access}</b> (<b>Edit</b> {role.permission[access]?.edit} | <b>View</b> {role.permission[access]?.view} | <b>Delete</b> {role.permission[access]?.delete})
                    </span>, &emsp; <br/>
                </>
                )
            })));
        }
    }, [data]);

    return(
        <div className='setting-body userRoleModal'>
            <div className='setting-body-inner'>
                <div className="setting-body-inner"></div> 
                <div className="setting-body-title">
                    <div className='setting-body-inner-title'>
                        User Role 
                    </div>
                </div>
                {/* descriptive text */}
                <div className="text">
                    Creation of new roles and efficient management of field-level access. Elevate control and security effortlessly for a more streamlined user experience.
                </div>
                <UserRoleGrid 
                    createUser={()=>setUserModal(!userModal)}
                    column={column} 
                    dataSource={userRoleData}   
                />
            </div>
            {userModal?
            <CreateUserRoleModal
             visible={userModal} onClose={()=>setUserModal(false)} 
            />
            :null}
        </div>
    );
}