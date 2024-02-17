import { useMutation, useQuery } from '@apollo/client';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Space, Table, Popover, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setGroupData } from '../../middleware/redux/reducers/group.reducer';
import { DeleteConfirmationModal } from './modal/deleteConfirmation.modal';
import { DELETE_GROUP } from '../../util/mutation/group.mutation';
import { setPropertyFilterByGroup } from '../../middleware/redux/reducers/properties.reducer';
import { Loader } from '../../components/loader';

const data = [
  {
    key: '1',
    name: 'Address line 1',
    use: '1',
  },
];
export const SettingGroupPropertyGrid = ({groupList, groupLoading, groupRefetch, editGroup, setActiveTab}) => {

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);
  const [deleteGroupConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [groupToBeDelete, setGroupToBeDelete] = useState({});
  const [groupIdToMoveIn, setGroupIdToMoveIn] = useState();

  const dispatch = useDispatch();

  useEffect(()=>{
    groupRefetch();
  },[groupRefetch])
  
  // console.log(data, "dataaa");

  const handleChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };


    
  const handleEdit = (record) => {
    // handle edit action for the selected record
    dispatch(setGroupData(record));
    editGroup();
  };

  const handleDelete = (record) => {
    // handle delete action for the selected record
    setGroupToBeDelete(record);
    setDeleteConfirmationModal(true);
  };

  const rowClassName = (record) => {
    return record.key === hoveredRow ? 'hovered-row' : '';
  };
  const handleRowMouseEnter = (record) => {
    setHoveredRow(record.key);
  };

  const handleRowMouseLeave = () => {
    setHoveredRow(null);
  };

  const handleViewProperty = (record) => {
    dispatch(setPropertyFilterByGroup(record));
    setActiveTab('1');
  };  

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      // width:300,
      render: (_, record) => {
        const showActions = hoveredRow === record.key;
        return (
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <div style={{lineHeight:'35px'}} className='truncated-text'>
                {record.name}
              </div>

              {showActions && 
              <div style={{width:'100%', display:'flex', justifyContent:'flex-end' ,alignItems:'center', columnGap:'5px'}}>
                <button  className="grid-sm-btn" type="link" onClick={() => handleEdit(record)}>
                  Edit
                </button>
                <button  className="grid-sm-btn" style={{width:'max-content'}} type="link" onClick={() => handleViewProperty(record)}>
                  View fields
                </button>

                <button  className="grid-sm-btn" type="link" onClick={() => handleDelete(record)}>
                  Delete
                </button>
              </div>
              }
            </div>
        );
      },

    },
    {
      title: 'Number of properties',
      dataIndex: 'properties',
      key: 'properties',
      sorter: (a, b) => a.properties - b.properties,
      sortOrder: sortedInfo.columnKey === 'properties' ? sortedInfo.order : null,
      ellipsis: true,
      width:100
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

  const [deleteGroup, {loading:deleteLoading}] = useMutation(DELETE_GROUP);

  const [api, contextHolder] = notification.useNotification();
  const deleteRecord = async ()=>{
    if(Object.keys(groupToBeDelete)){
      await deleteGroup({variables:{deleteGroupId: groupToBeDelete?.key, groupIdToMoveIn: groupIdToMoveIn?.id }});
      setDeleteConfirmationModal(false);
      await groupRefetch();
      setGroupToBeDelete(null);
      api.success({
        message: "Group was deleted",
        placement:"top",
        className: 'notification-without-close',
      });
    };
  }
  
  
  return (
    <div 
    className='setting-grid'>
      {contextHolder}
      {!groupLoading? 
      <>
      <Table 
        columns={columns} 
        dataSource={groupList?.length>0?[...groupList?.groupList]:null} 
        // rowSelection={rowSelection}
        onChange={handleChange}
        
        onRow={(record) => ({
          onMouseEnter: () => handleRowMouseEnter(record),
          onMouseLeave: () => handleRowMouseLeave(),
        })}
        rowClassName={rowClassName}

      />
      {deleteGroupConfirmationModal && 
      <DeleteConfirmationModal
        visible={deleteGroupConfirmationModal}
        onClose={()=>setDeleteConfirmationModal(false)}
        label={groupToBeDelete?.name}
        properties={groupToBeDelete?.properties}
        loading={deleteLoading}
        deleteRecord={deleteRecord}
        groupList={[...groupList?.groupList.filter((group)=>group.name!==groupToBeDelete?.name)]}
        title={"group"}
        additionalText={true}
        setGroupIdToMoveIn={setGroupIdToMoveIn}
      /> }
      </>
      : 
      <div style={{marginTop:'10%'}} >
        <Loader/>
      </div>
      }
    </div>
  );
};
