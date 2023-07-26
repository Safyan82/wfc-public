import React, { useEffect, useState } from 'react';
import { Layout, theme, Table, Input, Popover } from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import TabsComponent from '../tab';
import { Loader } from '../loader';
import { GetBranchObject } from '../../util/query/branch.query';
import { useQuery } from '@apollo/client';

  
const { Header, Content, Footer } = Layout;

const DataTable = ({header, data, loading}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const {data:branchProperties, loading: branchObjectLoading, refetch: branchObjectRefetch} = useQuery(GetBranchObject);
  const [dynamicColumn, setDynamicColumn]=useState([]);
  useEffect(()=>{
    if(branchProperties?.getBranchProperty?.response){

      const col = branchProperties?.getBranchProperty.response?.map((prop)=>({
        title: prop.propertyDetail.label,
        dataIndex: prop.propertyDetail.label.replaceAll(" ","").toLowerCase(),
        key: prop.propertyDetail.label.replaceAll(" ","").toLowerCase(),
      }));
      setDynamicColumn([...col])
    }
  }, [branchProperties?.getBranchProperty?.response]);

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
            {loading || branchObjectLoading?
            <Loader/>
            :
            <Table  
              bordered
              rowSelection={rowSelection}
              columns={dynamicColumn} 
              dataSource={dataSource} 
              pagination={{pageSize:5,}}
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