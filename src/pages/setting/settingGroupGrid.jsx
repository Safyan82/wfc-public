import { Button, Space, Table } from 'antd';
import { useState } from 'react';
const data = [
  {
    key: '1',
    name: 'Address line 1',
    use: '1',
  },
];
export const SettingGroupPropertyGrid = () => {
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
      title: 'Number of properties',
      dataIndex: 'use',
      key: 'use',
      sorter: (a, b) => a.use.length - b.use.length,
      sortOrder: sortedInfo.columnKey === 'use' ? sortedInfo.order : null,
      ellipsis: true,
      width:350
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
