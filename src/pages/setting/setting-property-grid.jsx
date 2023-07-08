import { useMutation } from '@apollo/client';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Popover, Space, Table, notification } from 'antd';
import { useEffect, useState } from 'react';
import { ARCHIVE_PROPERTY } from '../../util/mutation/properties.mutation';
import { ArchiveConfirmationModal } from './archeiveConfirmation.modal';
import { useDispatch } from 'react-redux';
import { setEditPropertyId } from '../../middleware/redux/reducers/createField.reducer';
import { useSelector } from 'react-redux';

export const SettingPropertyGrid = ({propertyList, setFieldModal, propertyListRefetch, refetch, setEditFieldModal}) => {
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
  const [archivedId, setArchivedId] = useState(null);

  const [api, contextHolder] = notification.useNotification();


  const [moreOption, setMoreoption]=useState(false);
  const [propertyName, setPropertyName] = useState("");


  const ArcheivePropertyGrid = async() => {
    try{
      if(archivedId){

        await archiveProperty({variables:{input:{id: archivedId}}});
        await propertyListRefetch();
        await refetch();
        setArchiveConfirmationModal(false);
        api.success({
          message: `${propertyName} was archived`,
          placement:"top",
          className: 'notification-without-close'        
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
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'label' ? sortedInfo.order : null,
      width:400,
      render: (_, record) => {
        const showActions = hoveredRow === record.key;
        return (          
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <div style={{lineHeight:'35px', width:'auto'}} className='truncated-text'>
              <span className='record-title'>{record.label}</span>
              <div className='record-subtitle'>{record.fieldType}</div>
            </div>

          {showActions && 
          <div style={{width:'100%', display:'flex', justifyContent:'flex-end' ,alignItems:'center', columnGap:'10px'}}>
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
                      <div className="popoverdataitem" >
                          Edit
                      </div>
                      <div className="popoverdataitem" >
                          Clone
                      </div>
                      <div className="popoverdataitem" >
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
    },
    {
      title: 'Created BY',
      dataIndex: 'createdBy',
      key: 'createdBy',
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === 'createdBy' ? sortedInfo.order : null,
      ellipsis: true,
      // render: (_, record) => {
      //   console.log(dayjs(record.createdAt).format('DD-MM-YY'), "rrr");
      //   return dayjs(record.createdAt).format('DD-MM-YY')
      // }
    },
    {
      title: 'USED IN',
      dataIndex: 'useIn',
      key: 'useIn',
      sorter: (a, b) => a.use.length - b.use.length,
      sortOrder: sortedInfo.columnKey === 'useIn' ? sortedInfo.order : null,
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
  
  
  const handleEdit = (record) => {
    // handle edit action for the selected record
  };

  const handleDelete = (record) => {
    // handle delete action for the selected record
  };

  const rowClassName = (record) => {
    return record.key === hoveredRow ? 'hovered-row' : '';
  };
  
  const handleRowMouseEnter = (record) => {
    setHoveredRow(record.key);
  };


  const handleRowMouseLeave = () => {
    setHoveredRow(null);
    setMoreoption(false);
  };
  
  return (
    <div 
    className='setting-grid'>
      {contextHolder}
      <Table 
        columns={columns} 
        dataSource={propertyList?.propertyList} 
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
        />
    </div>
  );
};
