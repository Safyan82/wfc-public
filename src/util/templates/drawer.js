import { LoadingOutlined } from "@ant-design/icons"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Drawer, Spin } from "antd"

export const Drawer = ({visible=true}) =>{
    return(
        <Drawer
            open={visible}
            placement="right"
            title={"Add Pay Level"}
            width={600}
            footer={
            <div className='drawer-footer' style={{display:'flex',gap:'20px'}}>
                <button  
                    onClick={()=>{}}
                    className={false?'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
                >
                    {false? <Spin indicator={<LoadingOutlined/>}/>: "Save"}
                </button>
                <button  className={false? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={()=>{}}>
                    Cancel
                </button>
            </div>
            }
            closable={true}
            onClose={()=>{}}
            closeIcon={<FontAwesomeIcon icon={faClose} onClick={()=>{}} className='close-icon'/>}
            maskClosable={false}
            mask={true}
        >


        </Drawer>
    )
}