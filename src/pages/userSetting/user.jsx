import './user.css';
import { Tabs } from 'antd';
import { useState } from 'react';
import { UserTab } from './component/userTabComponent/userTab';
import { CreateUserModal } from './modal/createUserModal';

export const User = ()=>{
    const {TabPane} = Tabs;
    const [activeTab, setActiveTab] = useState('1');
    const [userModal, setUserModal] = useState(false);

    const handelTabChange = (e)=>{
        setActiveTab(e);
    };

    return(
        <div className='setting-body'>
            <div className='setting-body-inner'> 
                <div className="propertyTab"></div>
                <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={handelTabChange}>
                    <TabPane tab={`User`} key="1" >
                        <UserTab createUser={()=>setUserModal(!userModal)}/>
                    </TabPane>
                    <TabPane tab="Team" key="2" >
                        
                    </TabPane>
                </Tabs>
            </div>
            {userModal?
            <CreateUserModal
             visible={userModal} onClose={()=>setUserModal(false)} 
            />
            :null}
        </div>
    );
}