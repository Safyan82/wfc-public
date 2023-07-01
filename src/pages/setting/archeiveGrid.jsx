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
export const ArcheivePropertyGrid = () => {
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

    },
    {
      title: 'Created By',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === 'age' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Property type',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'time archived',
      dataIndex: 'use',
      key: 'use',
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
