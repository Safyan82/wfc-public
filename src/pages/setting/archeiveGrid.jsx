import { useMutation, useQuery } from '@apollo/client';
import { Button, Space, Spin, Table, notification } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { BULK_DELETE_PROPERTIES, BULK_UNARCHIVE_PROPERTIES, DELETE_PROPERTY, UN_ARCHIVE_PROPERTY } from '../../util/mutation/properties.mutation';
import { DeleteConfirmationModal } from './modal/deleteConfirmation.modal';
import { Loader } from '../../components/loader';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faPlus, faRecycle, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { BulkDeleteConfirmationModal } from './modal/bulkDeleteConfirmation.modal';

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
    api.success({
      message:`${label} property was restored`,
      placement:'top',
      className:'notification-without-close',
    });
    await propertyListRefetch();
    await refetch();
    if(refetchedFiltered){
      refetchedFiltered();
    }
  };

  const [propertyName, setPropertyName] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [deleteBulkProperty, {loading: deleteBulkPropertyloading}] = useMutation(BULK_DELETE_PROPERTIES)
  const handelDelete= async () => {
    if(selectedRowKeys?.length>0){
      const properties = data?.filter((data)=> selectedRowKeys.find((key)=>data.key == key));
      await deleteBulkProperty({
        variables:{
          input: {properties}
        }
      });
      
      setConfirmationModal(false);
      api.success({
        message:`${selectedRowKeys?.length>1 ? selectedRowKeys?.length+" properties were deleted" : "1 property was deleted"}`,
        placement:'top',
        className:'notification-without-close',
      });
      setSelectedRowKeys([]);
      await refetch();
      await propertyListRefetch();
      if(refetchedFiltered){
        refetchedFiltered();
      }
      setPropertyName("");
      setPropertyId("");


    }else{
      
      await deleteProperty({variables:{input: {id:propertyId}}});
      setConfirmationModal(false);
      api.success({
        message:`${propertyName} property was deleted`,
        placement:'top',
        className:'notification-without-close',
      });
      await refetch();
      await propertyListRefetch();
      if(refetchedFiltered){
        refetchedFiltered();
      }
      setPropertyName("");
      setPropertyId("");

    }
  }

  const setProperties = (key,label)=>{
    setPropertyName(label);
    setConfirmationModal(true);
    setPropertyId(key);
  }

  function truncateText(text, maxWords) {
    // Split the text into an array of words
    const words = text.split(' ');
  
    
    if(words[0]?.length >15){maxWords=2}
    // If the number of words is less than or equal to the maximum allowed, return the original text
    if (words.length <= maxWords) {
      return text;
    }
  
    // Otherwise, join the first "maxWords" words and add ellipsis at the end
    return words.slice(0, maxWords).join(' ') + '...';
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
              {showActions?truncateText(record.label,3):truncateText(record.label,3)}
            </div>

            {showActions && selectedRowKeys?.length==0 &&
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
      sorter: (a, b) => a.fieldType.length - b.fieldType.length,
      sortOrder: sortedInfo.columnKey === 'fieldType' ? sortedInfo.order : null,
    },
    {
      title: 'time archived',
      dataIndex: 'archiveTime',
      key: 'archiveTime',
      sorter: (a, b) => a.archiveTime - b.archiveTime,
      sortOrder: sortedInfo.columnKey === 'archiveTime' ? sortedInfo.order : null,
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
  
  const [restoreProperties, {loading: restorePropertiesLoading}] = useMutation(BULK_UNARCHIVE_PROPERTIES)
  const bulkRestore= async()=>{
    await restoreProperties({variables:{ids: {ids: selectedRowKeys}}});
    api.success({
      message:`${selectedRowKeys.length<2 ?  selectedRowKeys.length +' property was restored' : selectedRowKeys.length + ' properties were restored'} `,
      placement:'top',
      className:'notification-without-close',
    });
    setSelectedRowKeys([]);
    await propertyListRefetch();
    await refetch();
    if(refetchedFiltered){
      refetchedFiltered();
    }
  };

  const customHeader =(

    <div className='table-footer' id="selection-options">
      

      {selectedRowKeys?.length>0 &&
      <>
          <small class='small-text'> {selectedRowKeys?.length} selected</small>

          <div onClick={bulkRestore}  style={{cursor:'pointer'}}>
              <FontAwesomeIcon icon={faRecycle} style={{marginRight:'5px'}}/> <span>Restore</span>
          </div>

          <div onClick={()=> setConfirmationModal(true)} style={{cursor:'pointer'}}>
              <FontAwesomeIcon icon={faTrashCan} style={{marginRight:'5px'}}/> <span>Delete</span>
          </div>


      </>
  }
    </div>
  )

  

  return (
    <div 
    className='setting-grid'>
      {contextHolder}
      {loading || restorePropertiesLoading ?
        <Loader/>        
      :
        <Table 
          columns={columns} 
          className='moveGroupTable'
          dataSource={data} 
          title={selectedRowKeys?.length>0 ? () => customHeader : null}
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
          <BulkDeleteConfirmationModal
            visible={confirmationModal}
            onClose={()=>setConfirmationModal(false)}
            deleteRecord={handelDelete}
            refresh = {async()=>{
              await refetch();
              await propertyListRefetch();
            }} 
            loading={deleteProperyLoading || deleteBulkPropertyloading}
            label={propertyName}
            title={""}
            properties={selectedRowKeys}

          />
        }

    </div>
  );
};
