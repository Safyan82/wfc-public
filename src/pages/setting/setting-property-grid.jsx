import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Popover, Space, Table } from 'antd';
import { useState } from 'react';
const data = [
  {
    key: '1',
    name: 'Address line 1',
    age: 'Branch information',
    address: 'Work force city',
    use: '1',
  },
];
export const SettingPropertyGrid = () => {
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);
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
      width:370,
      render: (_, record) => {
        console.log(record, "record")
        const showActions = hoveredRow === record.key;
        return (
          <div style={{display:'flex', alignItems:'center', columnGap:'7px'}}>
              <div>
                <span className='record-title'>{record.name}</span>
                <div className='record-subtitle'>single line text</div>
              </div> &nbsp;
               {showActions && <button className="grid-sm-btn" type="link" onClick={() => handleEdit(record)}>
                  Edit
                </button>}
                {showActions && <button  className="grid-sm-btn" type="link" onClick={() => handleDelete(record)}>
                  Clone
                </button>}
                {showActions && 
                <Popover
                  overlayClassName='settingCustomPopover'
                  trigger={"click"}
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
                      <div className="popoverdataitem" >
                          Archive
                      </div>
                    </div>
                  }
                >

                  <button className="grid-sm-btn" type="link" onClick={() => handleDelete(record)}>
                    <div style={{display: 'flex', gap: '0'}}>More <span className='caret'></span></div>
                  </button>
                </Popover>
                }
          </div>
        );
      },

    },
    {
      title: 'Group',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
      sortOrder: sortedInfo.columnKey === 'age' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'Created By',
      dataIndex: 'address',
      key: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      sortOrder: sortedInfo.columnKey === 'address' ? sortedInfo.order : null,
      ellipsis: true,
    },
    {
      title: 'USED IN',
      dataIndex: 'use',
      key: 'use',
      sorter: (a, b) => a.use.length - b.use.length,
      sortOrder: sortedInfo.columnKey === 'use' ? sortedInfo.order : null,
      ellipsis: true,
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
  };
  
  return (
    <div 
    className='setting-grid'>
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
    </div>
  );
};
