import { useQuery } from "@apollo/client";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Drawer, Table } from "antd";
import { GetBranchPropertyHistoryDetail } from "../../util/query/branchPropHistory";

export const PropertyDetailDrawer = ({visible, close, selectedProp}) =>{

    const {data: branchPropertyHistoryDetail, loading, error} = useQuery(GetBranchPropertyHistoryDetail,{
        variables:{
            input: {
                propertyId: selectedProp?.propertyId
            }
        },
        skip: !selectedProp?.propertyId,
        fetchPolicy: 'network-only'
    });

    const columns = [
        {
          title: 'Property value',
          dataIndex: 'value',
          key: 'value',
        },
        {
          title: 'Source',
          dataIndex: 'createdBy',
          key: 'createdby',
        },
        {
          title: 'Date',
          dataIndex: 'createdAt',
          key: 'date',
        },
    ];
      
    return(
        
        <Drawer
            title="Details"
            placement="right"
            closable={true}
            onClose={close}
            closeIcon={<FontAwesomeIcon icon={faClose} onClick={close} className='close-icon'/>}
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
            dataSource={branchPropertyHistoryDetail?.getBranchPropHistory?.response}
        />

        </Drawer>
    )
}