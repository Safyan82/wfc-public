import React, { useState } from 'react';
import { Table, Checkbox, Button } from 'antd';

const CheckboxTable = ({tableData, footerContent, onSelectChange, selectedRowKeys}) => {
 

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
        footer={footerContent}
      />
    </div>
  );
};

export default CheckboxTable;
