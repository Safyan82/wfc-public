import * as React from 'react';
import { Table } from 'antd';
import { DragOutlined } from '@ant-design/icons';
// import 'antd/dist/antd.css';
import dragula from 'dragula';
import './DraggableTable.css';
import eye from '../../assets/img/eye.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { New } from '../createFields/dynamicField';

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
const getIndexInParent = (el) => Array.from(el.parentNode.children).indexOf(el);

export default function DraggableTable({tableData, footerContent, onSelectChange, selectedRowKeys, customHeader}) {
  const [data, setData] = React.useState([...tableData]);
  React.useEffect(()=>{
    setData([...tableData]);
  },[tableData]);

  const handleReorder = (dragIndex, draggedIndex) => {
    setData((oldState) => {
      const newState = [...oldState];
      const item = newState.splice(dragIndex, 1)[0];
      newState.splice(draggedIndex, 0, item);
      return newState;
    });
  };

  React.useEffect(() => {
    let start;
    let end;
    const origin = document.querySelector('.ant-drawer')
    const container = origin.querySelector('tbody');
    const drake = dragula([container], {
      moves: (el) => {
        start = getIndexInParent(el);
        return true;
      },
    });

    drake.on('drop', (el) => {
      end = getIndexInParent(el);
      handleReorder(start, end);
    });
  }, []);

  
  React.useEffect(()=>{
    const origin = document.querySelector('.ant-drawer');
    const buttons = origin.querySelectorAll('button > .ant-switch-handle');
    console.log(buttons, "bbb");

    buttons.forEach(button => {
      const btn = button.parentElement;
      console.log(btn,'Button changed:');
      btn.addEventListener('change', event => {
        // Event handler code
        // Add your logic here
        console.log(event);
      });
    });
  }, []);

 

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

 

  return (
    <Table
      title={selectedRowKeys?.length>0 ? () => customHeader : null}
      className='customizedTable draggeableTable'
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      pagination={{pageSize:15}}
      footer={footerContent}
    />
  );
}
