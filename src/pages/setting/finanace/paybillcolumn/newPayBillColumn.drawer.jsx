import { LoadingOutlined } from "@ant-design/icons"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Drawer, Form, Input, Spin } from "antd"

export const NewPayBillColumnDrawer = ({visible, close}) =>{
    return(
        <Drawer
            open={visible}
            placement="right"
            title={"Add pay & bill column"}
            width={600}
            footer={
            <div className='drawer-footer' style={{display:'flex',gap:'20px'}}>
                <button  
                    onClick={()=>{}}
                    className={false?'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
                >
                    {false? <Spin indicator={<LoadingOutlined/>}/>: "Save"}
                </button>
                <button  className={false? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={()=>{close()}}>
                    Cancel
                </button>
            </div>
            }
            closable={true}
            onClose={()=>{}}
            closeIcon={<FontAwesomeIcon icon={faClose} onClick={()=>{close()}} className='close-icon'/>}
            maskClosable={false}
            mask={true}
        >

            <Form.Item>
                <label>Name</label>
                <Input
                    placeholder="Name"
                    className="generic-input-control"
                />
            </Form.Item>

            <Form.Item>
                <label>Column order</label>
                <Input
                    type="number"
                    placeholder="Column order"
                    className="generic-input-control"
                />
            </Form.Item>

        </Drawer>
    )
}