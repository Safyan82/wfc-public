import { useMutation, useQuery } from "@apollo/client";
import { Table } from "antd"
import Spinner from "../../../../components/spinner";
import { useState } from "react";
import { DeleteSkillCategoryMutation } from "../../../../util/mutation/skillCategory.mutation";
import { useDispatch } from "react-redux";
import { setNotification } from "../../../../middleware/redux/reducers/notification.reducer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export const CategoryGrid = ({categoryData, categoryLoading, refetchCategory})=>{
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

    const [deleteSkillCategory, {loading:deleteSkillCategoryLoading}] = useMutation(DeleteSkillCategoryMutation)
    const dispatch = useDispatch();

    const handelSkillCategoryDelete = async()=>{
        try{

            await deleteSkillCategory({
                variables:{
                    input:{
                        id: selectedRowKeys?.map((key)=>key.toString())
                    }
                }
            });

            await refetchCategory();
            setSelectedRowKeys([]);
            dispatch(setNotification({
                notificationState: true,
                error: false,
                message: "Skill Category was Delete Successfully",
            }));

        }catch(err){
            dispatch(setNotification({
                notificationState: true,
                error: true,
                message:"An Error Occured"
            }));
        }
    }

    
  const customHeader =(

    <div className='table-footer' style={{marginLeft:'-23px', backgroundColor: 'rgb(245, 248, 250)'}} id="selection-options">
      

    {selectedRowKeys?.length>0 &&
      <>
          <small class='small-text'> {selectedRowKeys?.length} selected</small>


          <div onClick={()=>handelSkillCategoryDelete()}>
              <FontAwesomeIcon icon={faTrashCan} style={{marginRight:'5px'}}/> <span>Delete</span>
          </div>

      </>
    }
    </div>
);

    return(
        
            categoryLoading ?

            <Spinner/>

            :

            <Table
                title={selectedRowKeys?.length>0 ? () => customHeader : null}
                className="moveGroupTable"
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