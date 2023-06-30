import { Button, Space, Table } from 'antd';
import { useState } from 'react';
const data = [
  {
    key: '1',
    name: 'Address line 1',
    age: 'Branch information',
    address: 'Work force city',
    use: '1',
  },
];
export const SettingPropertyGrid = () => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
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
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,

    },
    {
      title: 'Group',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === 'age' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Created By',
      dataIndex: 'address',
      key: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === 'address' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'USED IN',
      dataIndex: 'use',
      key: 'use',
      sorter: (a, b) => a.use.length - b.use.length,
      sortOrder: sortedInfo.columnKey === 'use' ? sortedInfo.order : null,
      ellipsis: true,
    },
  ];
  
  const [selectedRowKeys, setSelectedRowKeys]=useState([])

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  
  
  return (
    <div 
    className='setting-grid'>
      <Table 
        columns={columns} 
        dataSource={data} 
        rowSelection={rowSelection}
        onChange={handleChange} />
    </div>
  );
};
