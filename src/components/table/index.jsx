import React, { useEffect, useState } from 'react';
import { Layout, theme, Table, Input, Popover } from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import TabsComponent from '../tab';
import { Loader } from '../loader';
import { GetBranchObject } from '../../util/query/branch.query';
import { useQuery } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './table.css';
  
import { Resizable } from 'react-resizable';
import { EditColumn } from './editColumn/editColumn.modal';
const { Header, Content, Footer } = Layout;

export const DataTable = ({header, data, loading}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});
  const {data:branchProperties, loading: branchObjectLoading, refetch: branchObjectRefetch} = useQuery(GetBranchObject);
  const [dynamicColumn, setDynamicColumn]=useState([]);

  const handleResize = dataIndex => (e, { size }) => {
    setDynamicColumn(prevColumns => {
      const nextColumns = [...prevColumns];
      const index = nextColumns.findIndex(col => col.dataIndex === dataIndex);
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return nextColumns;
    });
  };
  useEffect(()=>{
    if(branchProperties?.getBranchProperty?.response){

      const col = branchProperties?.getBranchProperty.response?.map((prop)=>{
        // if(prop.propertyDetail.label=="Branch name" || prop.propertyDetail.label=="Post code"){

          return {
            title: prop.propertyDetail.label,
            dataIndex: prop.propertyDetail.label.replaceAll(" ","").toLowerCase(),
            key: prop.propertyDetail.label.replaceAll(" ","").toLowerCase(), // Initial width of the column
            width:200,
            onHeaderCell: (column) => ({
              width: column.width,
              onResize: handleResize(column.dataIndex),
            }),
          }
        // }
      })||[];
      setDynamicColumn([...col])
    }
  }, [branchProperties?.getBranchProperty?.response]);

  const [dataSource, setDataSource] = useState([]);

  
  useEffect(()=>{
    setDataSource(data?.branches.map((key,index) => {
      const {metadata, ...rest} = key;
      return {key:index ,...metadata, ...rest};
    }));
    console.log(data, "sufyan");
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

  const [editColumnModal, setEditColumnModal] = useState(false);

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
              components={{
                header: {
                  cell: ResizableTitle,
                },
              }}
              dataSource={dataSource} 
              pagination={{pageSize:5,}}
              title={!header? null : () => {
                if(header){
                return(
                  <div className='grid-table-search-input'>
                  
                    <Input type='search' style={{background: 'white', width:'250px', height:'33px'}} className='generic-input-control' placeholder='Search ...'  suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}/>
                    <div className="small-btn">
                      <button className='sm-btn'>Export</button> &emsp;
                      <button className='sm-btn' onClick={()=>setEditColumnModal(true)}>Edit columns</button>
                    </div>
                  </div>
                )}else{return null}
              }} 
            />
            }
            <EditColumn visible={editColumnModal} onClose={()=>setEditColumnModal(false)}/>
        </div>
      </Content>
      
    </Layout>
  );
};

const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={<span className="react-resizable-handle" />}
      onResize={onResize}
    >
      <th {...restProps} />
    </Resizable>
  );
};