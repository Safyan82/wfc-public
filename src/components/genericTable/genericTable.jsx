import React, {useState} from 'react';
import { faPencil, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, Table } from "antd"

export const GenericTable = ({column, dataSource})=>{
    
    // const columns = [
    //     {
    //       title: 'Name',
    //       dataIndex: 'name',
    //       key: 'name',
    //     },
    //     {
    //       title: 'Access',
    //       dataIndex: 'name',
    //       key: 'name',
    //     },
    //     {
    //       title: 'Last Active',
    //       dataIndex: 'name',
    //       key: 'name',
    //     },
    //     {
    //       title: 'Created Date',
    //       dataIndex: 'name',
    //       key: 'name',
    //     },
    // ];

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [hoveredRow, setHoveredRow] = useState(null);

    const rowClassName = (record) => {
        return record.key === hoveredRow ? 'hovered-row' : '';
    };
    

    const handleRowMouseEnter = (record) => {
        setHoveredRow(record.key);
        sessionStorage.setItem('hoverItem', record.key);
    };


    const handleRowMouseLeave = () => {
        setHoveredRow(null);
        // setMoreoption(false);
        sessionStorage.removeItem('hoverItem');

    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    // normal row selection
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    return (

        <Table
            className="history-table"
            bordered
            columns={column}
            dataSource={dataSource}
            
            onRow={(record) => ({
                onMouseEnter: () => handleRowMouseEnter(record),
                onMouseLeave: () => handleRowMouseLeave(),
            })}
            rowClassName={rowClassName}
            rowSelection={rowSelection}

            title={()=>
                <div className='grid-table-search-input'>
                
                  <div className='table-footer' id="selection-options">
                    <Input type='search' style={{background: 'white', width:'250px', height:'33px'}} className='generic-input-control' placeholder='Search ...'  suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}/>
                    {selectedRowKeys?.length>0 &&
                      <>
                          <small class='small-text'> {selectedRowKeys?.length} selected</small>

                          <div style={{fontSize:'11px'}}>
                            <FontAwesomeIcon icon={faPencil} style={{marginRight:'5px', fontSize:'10px'}} /> <span>Edit permissions</span>
                          </div>

                          <div style={{fontSize:'11px'}}>
                            <FontAwesomeIcon icon={faPencil} style={{marginRight:'5px', fontSize:'10px'}} /> <span>Add to team</span>
                          </div>
                      </>
                    }
                  </div>
                </div>
            }
        />
    )
}