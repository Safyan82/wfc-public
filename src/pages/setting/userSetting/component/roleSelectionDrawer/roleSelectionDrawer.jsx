import './roleSelectionDrawer.css';
import React from 'react';
import { Drawer } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import security from './assets/security.svg';

export const UserRoleSelectionDrawer = ({
  visible, onClose, setUserRoleModal
 }) => {

    return (
    <Drawer
        title={"Create user"}
        placement="right"
        closable={true}
        onClose={onClose}
        closeIcon={<FontAwesomeIcon icon={faClose} onClick={()=>{}} className='close-icon'/>}
        visible={visible}
        width={450}
        
        maskClosable={false}
        mask={true}
        footer={null}
    >
        <div className='userRoleSelection-box' onClick={()=>{ onClose();setUserRoleModal(true); }}>
            <img width={60} src={security} />
            <div style={{display:'flex', flexDirection:'column', gap: '4px'}}>
                <div style={{letterSpacing: '0.5px'}}>
                    System User
                </div>
                <div style={{display:'flex', flexDirection:'column', gap: '6px'}}>
                    <small className='small-text'>About 5 min</small>
                    <span style={{fontWeight: 'normal', fontSize:'14px', marginBottom: '16px'}}>
                        Invite your users with custom access permissions.
                    </span>
                </div>
            </div>
        </div> 

        <div className='userRoleSelection-box-disabled'>
            <img width={60} src={security} />
            <div style={{display:'flex', flexDirection:'column', gap: '4px'}}>
                <div style={{letterSpacing: '0.5px'}}>
                    Agency
                </div>
                <div style={{display:'flex', flexDirection:'column', gap: '6px'}}>
                    <small className='small-text'>About 5 min</small>
                    <span style={{fontWeight: 'normal', fontSize:'14px', marginBottom: '16px'}}>
                        Invite your users with custom access permissions.
                    </span>
                </div>
            </div>
        </div> 

        {/* Customer User */}
        <div className='userRoleSelection-box-disabled'>
            <img width={60} src={security} />
            <div style={{display:'flex', flexDirection:'column', gap: '4px'}}>
                <div style={{letterSpacing: '0.5px'}}>
                    Customer
                </div>
                <div style={{display:'flex', flexDirection:'column', gap: '6px'}}>
                    <small className='small-text'>About 5 min</small>
                    <span style={{fontWeight: 'normal', fontSize:'14px', marginBottom: '16px'}}>
                        Invite your users with custom access permissions.
                    </span>
                </div>
            </div>
        </div>       
    </Drawer>
    );
      
}