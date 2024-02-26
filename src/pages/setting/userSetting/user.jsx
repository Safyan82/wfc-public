import './user.css';
import { Tabs } from 'antd';
import { useState } from 'react';
import { UserTab } from './component/userTabComponent/userTab';
import { CreateUserModal } from './modal/createUserModal';
import { UserRoleSelectionDrawer } from './component/roleSelectionDrawer/roleSelectionDrawer';

export const User = ()=>{
    const {TabPane} = Tabs;
    const [activeTab, setActiveTab] = useState('1');
    const [userModal, setUserModal] = useState(false);

    const handelTabChange = (e)=>{
        setActiveTab(e);
    };

    const [userRoleModal, setUserRoleModal] = useState(false);

    return(
        <div className='setting-body'>
            <div className='setting-body-inner'> 
                <div className="propertyTab"></div>
                <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={handelTabChange}>
                    <TabPane tab={`User`} key="1" >
                        <UserTab 
                        setUserRoleModal={setUserRoleModal}
                        createUser={()=>setUserModal(!userModal)}/>
                    </TabPane>
                    <TabPane tab="Team" key="2" >
                        
                    </TabPane>
                </Tabs>
            </div>
            {userRoleModal?
            <CreateUserModal
             visible={userRoleModal} onClose={()=>setUserRoleModal(false)} 
            />
            :null}
            {userModal?
            <UserRoleSelectionDrawer 
                visible={userModal}  
                onClose={()=>setUserModal(false)} 
                setUserRoleModal={setUserRoleModal}
            />
            : null
            }
        </div>
    );
}