import { useQuery } from "@apollo/client";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Drawer, Table } from "antd";
import { GetBranchPropertyHistoryDetail } from "../../util/query/branchPropHistory";
import { Loader } from "../../components/loader";

export const PropertyDetailDrawer = ({visible, close, selectedProp, clearState, data, loading}) =>{

   

    const columns = [
        {
          title: 'Property value',
          dataIndex: 'value',
          key: 'value',
        },
        {
          title: 'Source',
          dataIndex: 'createdby',
          key: 'createdby',
        },
        {
          title: 'Date',
          dataIndex: 'createdAt',
          key: 'date',
        },
    ];
      
    return(
        loading?
        <Loader />
        :
        <Drawer
            title="Details"
            placement="right"
            closable={true}
            onClose={()=>{close();clearState(null);}}
            closeIcon={<FontAwesomeIcon icon={faClose} onClick={()=>{clearState(null); close()}} className='close-icon'/>}
            visible={visible}
            width={600}
            
            maskClosable={false}
            mask={true}
            footer={null}
        >

        <div className="prop-history">{selectedProp?.propertyName}</div>
        
        <hr className="hr"/>
        
        <Table
            className="history-table"
            columns={columns}
            dataSource={data}
        />

        </Drawer>
    )
}