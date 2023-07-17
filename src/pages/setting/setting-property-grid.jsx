import { useMutation } from '@apollo/client';
import { faLock, faTrash, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Popover, Space, Table, notification } from 'antd';
import { useEffect, useState } from 'react';
import { ARCHIVE_PROPERTY } from '../../util/mutation/properties.mutation';
import { ArchiveConfirmationModal } from './modal/archeiveConfirmation.modal';
import { useDispatch } from 'react-redux';
import { setEditPropertyId } from '../../middleware/redux/reducers/createField.reducer';
import { useSelector } from 'react-redux';
import { Loader } from '../../components/loader';
import { moveToGroup } from '../../middleware/redux/reducers/group.reducer';
import { BulkArchiveConfirmationModal } from './modal/bulkArchiveConfirmation.modal';
import { MoveGroupModal } from './modal/moveGroup.modal';

export const SettingPropertyGrid = ({propertyList,
  setFieldModal, propertyListRefetch, 
  refetch, setEditFieldModal, propertyListLoading, groupList}) => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);
  
  useEffect(()=>{
    propertyListRefetch();
  },[propertyListRefetch])

  const handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };


  // property archive mutation
  const [archiveProperty, {loading, error}] = useMutation(ARCHIVE_PROPERTY);
  const [archiveConfirmationModal, setArchiveConfirmationModal] = useState(false);
  const [bulkArchiveConfirmationModal, setBulkArchiveConfirmation] = useState(false);
  const [archivedId, setArchivedId] = useState(null);

  const [api, contextHolder] = notification.useNotification();


  const [moreOption, setMoreoption]=useState(false);
  const [propertyName, setPropertyName] = useState("");

  const [moveGroup, setMoveGroup] = useState(false);

  const ArcheivePropertyGrid = async() => {
    try{
      if(archivedId){

        await archiveProperty({variables:{input:{id: archivedId}}});
        setArchiveConfirmationModal(false);
        await propertyListRefetch();
        await refetch();
        api.success({
          message: `${propertyName} was archived`,
          placement:"top",
          className: 'notification-without-close',
        });
      }

    }catch(err){
      throw new Error(err.message);
    }
  }


  const dispatch = useDispatch();


  const columns = [
    {
      title: 'Name',
      dataIndex: 'label',
      key: 'label',
      sorter: (a, b) => a.label.length - b.label.length,
      sortOrder: sortedInfo.columnKey === 'label' ? sortedInfo.order : null,
      width:400,
      render: (_, record) => {
        const showActions = hoveredRow === record.key;
        return (          
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div style={{lineHeight:'35px', width:'auto'}} className='truncated-text' onClick={() => { dispatch(setEditPropertyId(record.key)); setEditFieldModal(true);}}>
              <Popover 
              overlayClassName='settingGridPopover'
              content={
                <div>
                  <div className='popover-record-title' style={{color:'white'}}>{record.label}</div>
                  <span>{record.description}</span>
                </div>
              }
              >
                <span className='record-title'>{record.label}</span>
              </Popover>
              <div className='record-subtitle'>{record.fieldType}</div>
            </div>

          {showActions && 
          <div style={{width:'60%', display:'flex', justifyContent:'flex-end' ,alignItems:'center', columnGap:'10px'}}>
            <button style={{marginLeft:'10%'}} className="grid-sm-btn" type="link" onClick={() => { dispatch(setEditPropertyId(record.key)); setEditFieldModal(true);}}>
              Edit
            </button>
            <button  className="grid-sm-btn" type="link" onClick={() => { setFieldModal(true); dispatch(setEditPropertyId(record.key))}}>
              Clone
            </button>

            <Popover
                  overlayClassName='settingCustomPopover'
                  trigger={"click"}
                  visible={moreOption}
                  content={
                    <div className="popover-data">
                      <div className="popoverdataitem"  onClick={() => { setMoreoption(!moreOption); dispatch(setEditPropertyId(record.key)); setEditFieldModal(true);}} >
                          Edit
                      </div>
                      <div className="popoverdataitem" onClick={() => { setMoreoption(!moreOption); setFieldModal(true); dispatch(setEditPropertyId(record.key))}} >
                          Clone
                      </div>
                      <div className="popoverdataitem" onClick={()=>{ setMoreoption(!moreOption); dispatch(moveToGroup([record])); setMoveGroup(true)}}>
                          Move to group
                      </div>
                      <div className="popoverdataitem" >
                          Export property history
                      </div>
                      <div className="popoverdataitem" >
                          Assign Users & Teams &nbsp;<FontAwesomeIcon icon={faLock}/>
                      </div>
                      <div className="popoverdataitem" onClick={()=>{
                          setArchiveConfirmationModal(true);
                          setMoreoption(false);
                          setPropertyName(record.label);
                          setArchivedId(record.key);
                        }}>
                          Archive
                      </div>
                    </div>
                  }
                >

              <button className="grid-sm-btn" type="link" onClick={() => setMoreoption(!moreOption)}>
                <div style={{display: 'flex', gap: '0'}}>More <span className='caret'></span></div>
              </button>
            </Popover>

          </div>
          }
        </div>
        );
      },

    },
    {
      title: 'Group',
      dataIndex: 'groupName',
      key: 'groupName',
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === 'groupName' ? sortedInfo.order : null,
      ellipsis: true,
      width:200,

    },
    {
      title: 'Created BY',
      dataIndex: 'createdBy',
      key: 'createdBy',
      sorter: (a, b) => a.address - b.address,
      sortOrder: sortedInfo.columnKey === 'createdBy' ? sortedInfo.order : null,
      ellipsis: true,
      width:150,

      // render: (_, record) => {
      //   console.log(dayjs(record.createdAt).format('DD-MM-YY'), "rrr");
      //   return dayjs(record.createdAt).format('DD-MM-YY')
      // }
    },
    {
      title: 'USED IN',
      dataIndex: 'useIn',
      key: 'useIn',
      sorter: (a, b) => a.use - b.use,
      sortOrder: sortedInfo.columnKey === 'useIn' ? sortedInfo.order : null,
      ellipsis: true,
      width:100
    },
  ];
  
  const [selectedRowKeys, setSelectedRowKeys]=useState([]);


  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  
  
  const handelBulkGroup = () => {
    // handle edit action for the selected record
    dispatch(moveToGroup(propertyList.filter((property)=> selectedRowKeys.includes(property.key))));
    setMoveGroup(true)

  };

  const handleDelete = (record) => {
    // handle delete action for the selected record
  };

  const rowClassName = (record) => {
    return record.key === hoveredRow ? 'hovered-row' : '';
  };
  
  const handleRowMouseEnter = (record) => {
    setHoveredRow(record.key);
    console.log(record.key);
  };


  const handleRowMouseLeave = () => {
    setHoveredRow(null);
    setMoreoption(false);
  };


  const customHeader =(

      <div className='table-footer' id="selection-options"
      // style={{
      //   height: '44px',
      //   fontSize: '12px',
      //   color: 'rgb(51, 71, 91)',
      //   padding:' 8px 24px 4px',
      //   textAlign: 'left',
      //   textTransform: 'uppercase',
      //   verticalAlign: 'middle',
      // }}
      >
        

        {selectedRowKeys?.length>0 &&
        <>
            <small class='small-text'> {selectedRowKeys?.length} selected</small>

            <div  onClick={handelBulkGroup}>
                <FontAwesomeIcon icon={faPlus} style={{marginRight:'5px'}}/> <span>Add to group</span>
            </div>

            <div onClick={()=>setBulkArchiveConfirmation(true)}>
                <FontAwesomeIcon icon={faTrashCan} style={{marginRight:'5px'}}/> <span>Archive</span>
            </div>

            <div  >
                 <span>Assign Users & Team</span> <FontAwesomeIcon icon={faLock} style={{marginLeft:'5px'}}/>
            </div>

        </>
    }
      </div>
    )

  return (
    <div 
    className='setting-grid'>
      {!propertyListLoading && propertyList?
      <>
        {contextHolder}
        <Table 
          title={selectedRowKeys?.length>0 ? () => customHeader : null}
          className='moveGroupTable'
          columns={columns} 
          dataSource={propertyList} 
          rowSelection={rowSelection}
          onChange={handleChange} 
          
          onRow={(record) => ({
            onMouseEnter: () => handleRowMouseEnter(record),
            onMouseLeave: () => handleRowMouseLeave(),
          })}
          rowClassName={rowClassName}

          />

        <ArchiveConfirmationModal 
          visible={archiveConfirmationModal}
          propertyName={propertyName}
          onClose={()=>setArchiveConfirmationModal(false)}
          ArcheivePropertyGrid={ArcheivePropertyGrid}
          loading={loading}
          
        />

        {bulkArchiveConfirmationModal &&
          <BulkArchiveConfirmationModal
            visible={bulkArchiveConfirmationModal}
            properties={selectedRowKeys?.length}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            refreshAll = {
              async() => {
                await propertyListRefetch();
                await refetch();
              }
            }


            onClose={()=>setBulkArchiveConfirmation(false)}
            ArcheivePropertyGrid={ArcheivePropertyGrid}
            loading={loading}
          />
        }


      <MoveGroupModal
          groupList={groupList}
          visible={moveGroup}
          propertyListRefetch={propertyListRefetch}
          setSelectedRowKeys={setSelectedRowKeys}
          onClose={()=>setMoveGroup(false)}
        />


      </>
      : 
      <div style={{marginTop:'10%'}} >
        <Loader />
      </div>
      }
    </div>
  );
};
