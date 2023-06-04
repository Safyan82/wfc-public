import React from 'react';
import { Tabs } from 'antd';
const { TabPane } = Tabs;

const TabsComponent = () => {
  const handleTabChange = (key) => {
    console.log('Selected Tab:', key);
  };

  return (
    <Tabs defaultActiveKey="1" onChange={handleTabChange} style={{padding:'5px'}}>
      <TabPane tab="View 1" key="1"/>
      <TabPane tab="View 2" key="2"/>
    </Tabs>
  );
};

export default TabsComponent;

