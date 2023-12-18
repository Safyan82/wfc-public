import { Tabs } from 'antd';
import { useState } from 'react';
import { CreateUserRoleModal } from './userRole.modal';
import { UserRoleGrid } from './userRoleGrid';
import "./userRole.css";

export const UserRole = ()=>{
    const {TabPane} = Tabs;
    const [activeTab, setActiveTab] = useState('1');
    const [userModal, setUserModal] = useState(false);

    const handelTabChange = (e)=>{
        setActiveTab(e);
    };

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
                <UserRoleGrid createUser={()=>setUserModal(!userModal)}/>
            </div>
            {userModal?
            <CreateUserRoleModal
             visible={userModal} onClose={()=>setUserModal(false)} 
            />
            :null}
        </div>
    );
}