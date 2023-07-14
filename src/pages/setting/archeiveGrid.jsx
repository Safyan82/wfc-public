import { useMutation, useQuery } from '@apollo/client';
import { Button, Space, Spin, Table, notification } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { DELETE_PROPERTY, UN_ARCHIVE_PROPERTY } from '../../util/mutation/properties.mutation';
import { DeleteConfirmationModal } from './modal/deleteConfirmation.modal';
import { Loader } from '../../components/loader';
import { useSelector } from 'react-redux';

export const ArcheivePropertyGrid = ({data, refetch, propertyListRefetch, loading}) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  const handleChange = (pagination, filters, sorter) => {
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
  const [confirmationModal, setConfirmationModal] = useState(false);

  const { refetchedFiltered } = useSelector(state => state.archiveReducer);

  const handelRestore= async(id, label) => {
    await unArchiveProperty({variables:{input: {id}}});
    await refetch();
    await propertyListRefetch();
    if(refetchedFiltered){
      refetchedFiltered();
    }
    api.success({
      message:`${label} property was restored`,
      placement:'top',
      className:'notification-without-close',
    });
  };

  const [propertyName, setPropertyName] = useState("");
  const [propertyId, setPropertyId] = useState("");

  const handelDelete= async () => {
    if(propertyId){

      await deleteProperty({variables:{input: {id:propertyId}}});
      await refetch();
      await propertyListRefetch();
      setConfirmationModal(false);
      api.success({
        message:`${propertyName} property was deleted`,
        placement:'top',
        className:'notification-without-close',
      });
      setPropertyName("");
      setPropertyId("");
    }
  }

  const setProperties = (key,label)=>{
    setPropertyName(label);
    setConfirmationModal(true);
    setPropertyId(key);
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
              <button  className="grid-sm-btn" type="link" onClick={()=>setProperties(record.key, record.label)} >
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
      {loading ?
        <Loader/>        
      :
        <Table 
          columns={columns} 
          dataSource={data} 
          rowSelection={rowSelection}
          onChange={handleChange} 
          
          
          onRow={(record) => ({
            onMouseEnter: () => handleRowMouseEnter(record),
            onMouseLeave: () => handleRowMouseLeave(),
          })}
          rowClassName={rowClassName}


          />
        }

        {
          confirmationModal &&
          <DeleteConfirmationModal
            visible={confirmationModal}
            onClose={()=>setConfirmationModal(false)}
            deleteRecord={handelDelete}
            refresh = {async()=>{
              await refetch();
              await propertyListRefetch();
            }} 
            label={propertyName}
            title={"property"}

          />
        }

    </div>
  );
};
