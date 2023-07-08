import { useQuery } from '@apollo/client';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Space, Table, Popover } from 'antd';
import { useEffect, useState } from 'react';

const data = [
  {
    key: '1',
    name: 'Address line 1',
    use: '1',
  },
];
export const SettingGroupPropertyGrid = ({groupList, groupLoading, groupRefetch}) => {

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);

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
  

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      width:300,
      render: (_, record) => {
        const showActions = hoveredRow === record.key;
        return (
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <div style={{lineHeight:'35px'}} className='truncated-text'>
                {record.name}
              </div>

              {showActions && 
              <div style={{width:'100%', display:'flex', justifyContent:'flex-end' ,alignItems:'center', columnGap:'10px'}}>
                <button style={{marginLeft:'10%'}} className="grid-sm-btn" type="link" onClick={() => handleEdit(record)}>
                  Edit
                </button>
                <button  className="grid-sm-btn" type="link" onClick={() => handleDelete(record)}>
                  View properties
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
      sorter: (a, b) => a.use.length - b.use.length,
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
  
  
  return (
    <div 
    className='setting-grid'>
      <Table 
        columns={columns} 
        dataSource={[...groupList.groupList]} 
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
