import { useQuery } from "@apollo/client";
import { Table } from "antd"
import { SkillCategoryQuery } from "../../../util/query/skillCategory.query";
import Spinner from "../../../components/spinner";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCancel, faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

export const SkillGrid = ({skill, loading})=>{
    const columns = [
        {title:'Skill', dataIndex: 'skill'}, 
        {title:'Description', dataIndex:'description'}, 
        {title:'Category', dataIndex:'categoryId'},
        {title:'Hard Skill', dataIndex:'hardSkill'},
        {title:'Any Date', dataIndex:'anyDate'},
        // {title:'Date Fields', dataIndex:'dateFields'},
        {title:'Digital Certificate', dataIndex:'digitalCertificate'},
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

    console.log(skill, "skillData");

    return(
        
        <div style={{textAlign:'center', margin:'auto'}}>
            {loading?
                <Spinner/>
    
                :
    
                <Table
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