import React, {useState} from 'react';
import { faPencil, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input, Table } from "antd"

export const GenericTable = ({column, 
    dataSource, setSearchKeyword, 
    handleRowMouseEnter, hoveredRow, setHoveredRow, tableOption=["Edit"], tableOptionFunc=[()=>{}],
    selectedRowKeys, setSelectedRowKeys,
  })=>{
    
   

    const rowClassName = (record) => {
        return record.key === hoveredRow ? 'hovered-row' : '';
    };
    


    const handleRowMouseLeave = () => {
        setHoveredRow(null);
        // setMoreoption(false);
        sessionStorage.removeItem('RolehoverItem');

    };

    const onSelectChange = (newSelectedRowKeys) => {
        console.log(newSelectedRowKeys, "newSelectedRowKeys");
        setSelectedRowKeys(newSelectedRowKeys);
    };

    // normal row selection
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    console.log(tableOptionFunc, "")
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
                    <Input type='search' onChange={(e)=>setSearchKeyword(e.target.value)} style={{background: 'white', width:'250px', height:'33px'}} className='generic-input-control' placeholder='Search ...'  suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}/>
                    {selectedRowKeys?.length>0 &&
                      <>
                          <small class='small-text' style={{margin: 0 }}> {selectedRowKeys?.length} selected</small>

                          <div style={{fontSize:'11px'}} className={selectedRowKeys?.length>1? 'disabled': null} onClick={selectedRowKeys?.length>1? ()=>{return false;} :tableOptionFunc[0]}>
                            <FontAwesomeIcon icon={faPencil} style={{marginRight:'5px', fontSize:'10px'}} /> <span>{tableOption[0]}</span>
                          </div>


                          {tableOption?.length>1?<div style={{fontSize:'11px'}} className={selectedRowKeys?.length>1? 'disabled': null} onClick={selectedRowKeys?.length>1? ()=>{return false;} :tableOptionFunc[1]}>
                            <FontAwesomeIcon icon={faTrash} style={{marginRight:'5px', fontSize:'10px'}} /> <span >{tableOption[1]}</span>
                          </div>:null}
                      </>
                    }
                  </div>
                </div>
            }
        />
    )
}