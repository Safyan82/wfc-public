import './user.css';
import '../setting.css';
import { Tabs } from 'antd';
import { useState } from 'react';
import { UserTab } from './userTabComponent/userTab';

export const User = ()=>{
    const {TabPane} = Tabs;
    const [activeTab, setActiveTab] = useState('1');

    const handelTabChange = (e)=>{
        console.log(e, "eeee");
        setActiveTab(e);
    };

    return(
        <div className='setting-body setting-body-inner'
>
            <div className="propertyTab"></div>
            <Tabs defaultActiveKey="1" activeKey={activeTab} onChange={handelTabChange}>
                <TabPane tab={`User`} key="1" >
                    <UserTab/>
                </TabPane>
                <TabPane tab="Team" key="2" >
                    
                </TabPane>
            </Tabs>
        </div>
    );
}