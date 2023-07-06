import { useMutation, useQuery } from '@apollo/client';
import { Button, Space, Table, notification } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { DELETE_PROPERTY, UN_ARCHIVE_PROPERTY } from '../../util/mutation/properties.mutation';

export const ArcheivePropertyGrid = ({data, refetch}) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };




  const [hoveredRow, setHoveredRow] = useState(null);
  
  const rowClassName = (record) => {
    return record.key === hoveredRow ? 'hovered-row' : '';
  };

   
  const handleRowMouseEnter = (record) => {
    setHoveredRow(record.key);
  };


  const handleRowMouseLeave = () => {
    setHoveredRow(null);
  };

  const [api, contextHolder] = notification.useNotification();

  const [unArchiveProperty, {loading: unArchiveProperyLoading,}] = useMutation(UN_ARCHIVE_PROPERTY);
  const [deleteProperty, {loading: deleteProperyLoading,}] = useMutation(DELETE_PROPERTY);

  const handelRestore= async(id, label) => {
    await unArchiveProperty({variables:{input: {id}}});
    await refetch();
    api.success({
      message:`${label} property was restored`,
      placement:'top',
      className:'notification-without-close',
    });
  };

  const handelDelete= async (id, label) => {
    await deleteProperty({variables:{input: {id}}});
    await refetch();
    api.success({
      message:`${label} property was deleted`,
      placement:'top',
      className:'notification-without-close',
    });
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'label',
      key: 'label',
      // width:800,
      sorter: (a, b) => a.label.length - b.label.length,
      sortOrder: sortedInfo.columnKey === 'label' ? sortedInfo.order : null,
      width: 350,
      render: (_, record) => {
        console.log(hoveredRow, record.key , 'dasdasd');
        const showActions = hoveredRow === record.key;
        return (
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div style={{lineHeight:'35px'}} className='truncated-text'>
              {record.label}
            </div>

            {showActions && 
            <div style={{width:'100%', display:'flex', justifyContent:'flex-end' ,alignItems:'center', columnGap:'10px'}}>
              <button style={{marginLeft:'10%'}} className="grid-sm-btn" type="link" onClick={()=>handelRestore(record.key, record.label)} >
                Restore
              </button>
              <button  className="grid-sm-btn" type="link" onClick={()=>handelDelete(record.key, record.label)} >
                Delete
              </button>
            </div>
            }
          </div>
        )},
    },

    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === 'age' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Property type',
      dataIndex: 'fieldType',
      key: 'fieldType',
    },
    {
      title: 'time archived',
      dataIndex: 'archiveTime',
      key: 'archiveTime',
      render:(_,record)=>{
        return (dayjs(Number(record.archiveTime)).format('DD-MM-YY hh:mm A'))
      }
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
      {contextHolder}
      <Table 
        columns={columns} 
        dataSource={data?.getArchiveProperties} 
        rowSelection={rowSelection}
        onChange={handleChange} 
        
        
        onRow={(record) => ({
          onMouseEnter: () => handleRowMouseEnter(record),
          onMouseLeave: () => handleRowMouseLeave(),
        })}
        rowClassName={rowClassName}


        />

    </div>
  );
};
