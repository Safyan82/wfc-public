import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Drawer } from "antd";

export const PropertyDetailDrawer = ({visible, close}) =>{
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

        <div className="prop-history">Branch Name</div>
        
        
        
        </Drawer>
    )
}