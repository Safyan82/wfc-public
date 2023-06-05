import React, { useState } from 'react';
import { Layout, theme, Table, Input, Popover } from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import TabsComponent from '../tab';

  
const { Header, Content, Footer } = Layout;

const data= [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
];

const DataTable = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filters: [
        { text: 'Joe', value: 'Joe' },
        { text: 'Jim', value: 'Jim' },
      ],
      filteredValue: filteredInfo.name || null,
      onFilter: (value, record) => record.name.includes(value),
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === 'age' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      filters: [
        { text: 'London', value: 'London' },
        { text: 'New York', value: 'New York' },
      ],
      filteredValue: filteredInfo.address || null,
      onFilter: (value, record) => record.address.includes(value),
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === 'address' ? sortedInfo.order : null,
      ellipsis: true,
    },
  ];

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

  // advance row selection not implemented yet
  const customrowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'odd',
        text: 'Select Odd Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: 'even',
        text: 'Select Even Row',
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  return (
    <Layout className='bg-white'>
      <Content className="site-layout" style={{ padding: '0 42px' }}>
        <div style={{ padding: 5, minHeight: 450, background: colorBgContainer }}>
            {/* <TabsComponent/> */}
            <Table  
              bordered
              rowSelection={
                {
                  type: 'Checkbox',
                  ...rowSelection,
                }
              } 
              columns={columns} 
              dataSource={data} 
              onChange={handleChange}
              
              title={() => {
                return(
                  <div className='grid-table-search-input'>
                    
                    <Popover  
                        // overlayInnerStyle={{background:'red', color: "white"}}
                        // overlayStyle={{background:'red', color: "white"}}
                        // overlayClassName='grid-custom-popover'
                        content={"Search name, phone, email, address"} 
                        placement='right'
                        trigger="click"
                    >
                        <Input type='search' placeholder='Search name, phone, email'  suffix={<SearchOutlined />}/>
                    </Popover>
                    </div>
                )
              }} 
            />
        </div>
      </Content>
      
    </Layout>
  );
};

export default DataTable;