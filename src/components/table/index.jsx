import React, { useEffect, useState } from 'react';
import { Layout, theme, Table, Input, Popover } from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import TabsComponent from '../tab';

  
const { Header, Content, Footer } = Layout;

const DataTable = ({header, data}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const [loading, setLoading]= useState(false);
  const [dynamicColumn, setDynamicColumn] = useState([
    {
      title: 'Branch Name',
      dataIndex: 'branchName',
      key: 'branchName',
    },
    {
      title: 'Post code',
      dataIndex: 'postCode',
      key: 'postCode',
    },
    {
      title: 'Address Line 1',
      dataIndex: 'AddressLine1',
      key: 'AddressLine1'
    },
    {
      title: 'Address Line 2',
      dataIndex: 'AddressLine2',
      key: 'AddressLine2',
    },
    {
      title: 'City',
      dataIndex: 'City',
      key: 'City',
    },
  ]);

  const [dataSource, setDataSource] = useState([]);

  
  useEffect(()=>{
    setDataSource(data?.branches.map((key,index) => {
      const {metadata, ...rest} = key;
      return {key:index ,...metadata, ...rest};
    }));
  },[data?.branches])


  useState(()=>{console.log(dataSource)},[dataSource])


  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  const handleChange = (pagination, filters, sorter) => {};


  const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
  };


  // normal row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


  return (
    <Layout className='bg-white'>
      <Content className="site-layout" style={{ padding: '0 42px' }}>
        <div style={{ padding: 5, minHeight: 450, background: colorBgContainer }}>
            {/* <TabsComponent/> */}
            {!loading &&
            <Table  
              bordered
              rowSelection={rowSelection}
              columns={dynamicColumn} 
              dataSource={dataSource} 
              pagination={{pageSize:5}}
              title={!header? null : () => {
                if(header){
                return(
                  <div className='grid-table-search-input'>
                    
                    <Popover  
                        content={"Search name, phone, email, address"} 
                        placement='right'
                        trigger="click"
                    >
                        <Input type='search' placeholder='Search name, phone, email'  suffix={<SearchOutlined />}/>
                    </Popover>
                    </div>
                )}else{return null}
              }} 
            />
            }
        </div>
      </Content>
      
    </Layout>
  );
};

export default DataTable;