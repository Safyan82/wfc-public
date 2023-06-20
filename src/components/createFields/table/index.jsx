import React, { useState } from 'react';
import { Table, Checkbox } from 'antd';


const CheckboxTable = ({tableData}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const columns = [
    {
      title: 'LABEL',
      dataIndex: 'label',
      key: 'label',
    },
    {
      title: 'INTERNAL VALUE',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'IN FORMS',
      dataIndex: 'toggle',
      key: 'toggle',
    },
  ];

  const data = [
    {
      key: '1',
      label: 'John Doe',
      value: 25,
      toggle: '123 Main St',
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div>
      <Table
        className='customizedTable'
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tableData}
        pagination={{pageSize:50}}
      />
    </div>
  );
};

export default CheckboxTable;
