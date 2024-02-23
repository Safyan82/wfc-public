import { useQuery } from "@apollo/client";
import { Table } from "antd"
import { SkillCategoryQuery } from "../../../util/query/skillCategory.query";
import Spinner from "../../../components/spinner";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCheck, faPlus, faTimes, faTrashCan } from "@fortawesome/free-solid-svg-icons";

export const SkillGrid = ({skill, loading})=>{
    const columns = [
        {title:'Skill', dataIndex: 'skill'}, 
        {title:'Description', dataIndex:'description'}, 
        {title:'Category', dataIndex:'categoryId'},
        {title:'Hard Skill', dataIndex:'hardSkill'},
        {title:'Any Date', dataIndex:'anyDate'},
        // {title:'Date Fields', dataIndex:'dateFields'},
        {title:'Digital Certificate', dataIndex:'digitalCertificate'},
        {title:'Created By', dataIndex:'createdBy'},
        {title:'Created At', dataIndex:'createdAt'},
        // {title:'Digital Fields', dataIndex:'digitalFields'},
    ];

    

    const [hoveredRow, setHoveredRow] = useState(null);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);


    const onSelectChange = (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    };
  
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
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
    };

    
  const customHeader =(

    <div className='table-footer' style={{marginLeft:'-23px', backgroundColor: 'rgb(245, 248, 250)'}} id="selection-options">
      

    {selectedRowKeys?.length>0 &&
      <>
          <small class='small-text'> {selectedRowKeys?.length} selected</small>


          <div onClick={()=>console.log(true)}>
              <FontAwesomeIcon icon={faTrashCan} style={{marginRight:'5px'}}/> <span>Delete</span>
          </div>

      </>
    }
    </div>
);

    return(
        
        <div style={{textAlign:'center', margin:'auto'}}>
            {loading?
                <Spinner/>
    
                :
    
                <Table
                    title={selectedRowKeys?.length>0 ? () => customHeader : null}
                    className="moveGroupTable"
                    dataSource={skill?.map((data)=>({
                        ...data, 
                        key: data?._id, 
                        hardSkill: data?.hardSkill? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} /> ,
                        anyDate: data?.anyDate? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} /> ,
                        digitalCertificate: data?.digitalCertificate? <FontAwesomeIcon icon={faCheck} /> : <FontAwesomeIcon icon={faTimes} /> ,
                    }))}
                    
                    columns={columns}
                    rowSelection={rowSelection}                
                    onRow={(record) => ({
                        onMouseEnter: () => handleRowMouseEnter(record),
                        onMouseLeave: () => handleRowMouseLeave(),
                    })}
                    rowClassName={rowClassName}
                />
            }
        </div>

        
    )
}