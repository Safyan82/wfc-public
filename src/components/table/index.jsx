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
      // sorter: (a, b) => a.branchName.length - b.branchName.length,
      // sortOrder: sortedInfo.columnKey === 'branchName' ? sortedInfo.order : null,
      // ellipsis: true,
    },
    {
      title: 'Post code',
      dataIndex: 'postCode',
      key: 'postCode',
      // sorter: (a, b) => a.postCode - b.postCode,
      // sortOrder: sortedInfo.columnKey === 'postCode' ? sortedInfo.order : null,
      // ellipsis: true,
    },
    {
      title: 'Address Line 1',
      dataIndex: 'AddressLine1',
      key: 'AddressLine1',
      // sorter: (a, b) => a.postCode - b.postCode,
      // sortOrder: sortedInfo.columnKey === 'postCode' ? sortedInfo.order : null,
      // ellipsis: true,
    },
    {
      title: 'Address Line 2',
      dataIndex: 'AddressLine2',
      key: 'AddressLine2',
      // sorter: (a, b) => a.postCode - b.postCode,
      // sortOrder: sortedInfo.columnKey === 'postCode' ? sortedInfo.order : null,
      // ellipsis: true,
    },
    {
      title: 'City',
      dataIndex: 'City',
      key: 'City',
      // sorter: (a, b) => a.postCode - b.postCode,
      // sortOrder: sortedInfo.columnKey === 'postCode' ? sortedInfo.order : null,
      // ellipsis: true,
    },
  ]);

  const [dataSource, setDataSource] = useState([]);

  const formateColumn = (str) => {
    return str.replace(/([A-Z])/g, ' $1').trim();
  }
  
  useEffect(()=>{
    setDataSource(data?.branches.map(key => {
      const {metadata, ...rest} = key;
      return {...metadata, ...rest};
    }));
  },[data?.branches])


  useState(()=>{console.log(dataSource)},[dataSource])

  // useEffect(()=>{
  //   setLoading(true);
  //   // console.log(data?.branches[0]?.metadata);
  //   // let columns = [];
  //   // // Object.keys(data?.branches[0]?.metadata)?.forEach((meta)=>{
  //   // //   columns.push({
  //   // //     title: formateColumn(meta),
  //   // //     dataIndex: meta,
  //   // //     key: meta,
  //   // //   });
  //   // // });
  //   // // setDynamicColumn([
  //   // //   ...dynamicColumn,
  //   // //   ...columns,
  //   // // ]);
  //   setLoading(false);
    
  // },[data?.branches]);

  // useEffect(()=>{
  //   console.log(dynamicColumn);
  // },[dynamicColumn]);



  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  const handleChange = (pagination, filters, sorter) => {};


  const onSelectChange = (newSelectedRowKeys) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
  };


  // normal row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };


  return (
    <Layout className='bg-white'>
      <Content className="site-layout" style={{ padding: '0 42px' }}>
        <div style={{ padding: 5, minHeight: 450, background: colorBgContainer }}>
            {/* <TabsComponent/> */}
            {!loading &&
            <Table  
              bordered
              rowSelection={
                {
                  type: 'Checkbox',
                  ...rowSelection,
                }
              } 
              columns={dynamicColumn} 
              dataSource={dataSource} 
              onChange={handleChange}
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