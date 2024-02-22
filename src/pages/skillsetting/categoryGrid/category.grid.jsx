import { useQuery } from "@apollo/client";
import { Table } from "antd"
import { SkillCategoryQuery } from "../../../util/query/skillCategory.query";
import Spinner from "../../../components/spinner";
import { useState } from "react";

export const CategoryGrid = ({categoryData, categoryLoading})=>{
    const columns = [
        {title:'Category', dataIndex: 'category'}, {title:'Created By', dataIndex:'createdBy'}, {title:'Created At', dataIndex:'createdAt'}
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

    console.log(categoryData?.getSkillCategories, "categoryData?.getSkillCategories");

    return(
        
            categoryLoading?

            <Spinner/>

            :

            <Table
                dataSource={categoryData?.getSkillCategories?.map((data)=>({...data, key: data?._id}))}
                columns={columns}
                rowSelection={rowSelection}                
                onRow={(record) => ({
                    onMouseEnter: () => handleRowMouseEnter(record),
                    onMouseLeave: () => handleRowMouseLeave(),
                })}
                rowClassName={rowClassName}
            />
        
    )
}