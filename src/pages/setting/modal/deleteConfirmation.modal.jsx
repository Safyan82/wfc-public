import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Modal, Select, Button, notification, Spin } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faSearch } from '@fortawesome/free-solid-svg-icons';
import { LoadingOutlined } from '@ant-design/icons';
import Spinner from '../../../components/spinner';

export const DeleteConfirmationModal = ({ refresh, visible, onClose, deleteRecord, label, additionalText, title, loading, properties, groupList, setGroupIdToMoveIn}) => {
 
  
  const popoverRef = useRef(null);
  const inputRef = useRef(null);
  const [localGroup, setLocalGroup] = useState(groupList||[]);
  const [groupInput, setGroupInput] = useState({name:"Select a group", id:0});
  const [groupPopover, setGroupPopover] = useState(false);
  const [parentWidth, setParentWidth] = useState(null);
  const parentRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.group-wrapper')) {
        setGroupPopover(false);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {

    const updateParentWidth = () => {
      if (parentRef.current) {
        const width = parentRef.current.offsetWidth;
        setParentWidth(width);
      }
    };

    // Call the update function on initial mount and window resize
    updateParentWidth();
    window.addEventListener('resize', updateParentWidth);
    inputRef?.current?.focus();

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', updateParentWidth);
    };

  }, [groupPopover]);
  useEffect(()=>{
    if(setGroupIdToMoveIn){
      setGroupIdToMoveIn(groupInput)
    }
  }, [groupInput]);
  const style = {padding:'0px 40px 26px 40px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' };
  const Propertystyle = {padding:'0px 40px 26px 40px', textAlign:'left',  marginTop:'-25px' };
  console.log(loading || (properties? groupInput?.name == "Select a group" : false));
  return (
    <Modal
      visible={visible}
      width={450}
      style={{borderRadius:'3px'}}
      footer={
        <div style={properties? Propertystyle : style}>
            <button  disabled={loading} className={loading || (properties? groupInput?.name == "Select a group" : false)? 'disabled-btn archive-btn': 'archive-btn'}
            style={properties?{marginRight:'3%'}:null}
            onClick={deleteRecord}>{loading? <Spinner/> :
            properties ? "Move property & delete group" : "Delete"}</button>
            <button  disabled={loading}  className={loading? 'disabled-btn dim-btn': 'dim-btn'} onClick={onClose}>Cancel</button>
        </div>
      }
      closable={false}
    >
      <React.Fragment>
        <div className='archive-modal-header modal-header-title'>
            <span className='archive-font'>
                Delete {additionalText ? label + " ?": 'the ' + title +" "}
                {!additionalText && label + " ?"}
            </span>
            <span  onClick={onClose}><FontAwesomeIcon className='close' icon={faClose}/></span>
        </div>
        <div className='modal-body'>
          
          <div className="text">
            {additionalText ? 
              properties? 
              `You must move ${properties} property to delete this group permanently from your CRM.`
              :
              "This group will be permanently deleted from your CRM. This action can't be undone."
              :
            
             `Are you sure to delete this ${title}?`
            }
          </div>

          {properties ?
          <Form.Item>
              <label>Move property to..</label>
              
                <div className="group-wrapper">
                    <Input
                        name="groupInput"
                        className='generic-input-control groupInput' 
                        value={groupInput.name}
                        style={{cursor:'pointer', padding:'0 0px'}}
                        onClick={()=>setGroupPopover(!groupPopover)}
                        suffix={<span onClick={()=>setGroupPopover(!groupPopover)} 
                        style={{
                            position: 'absolute',
                            right: '6px'
                        }} className='caret'></span>}
                        readOnly
                    />

                    <div ref={parentRef} className={groupPopover? 'show': 'hide'}>
                        <div className="moveGroupData" style={{width: parentWidth-1.5}} >
                            <div className="popover-search" >
                                <Input type="text" 
                                    ref={inputRef}
                                    name='popoverSearch'
                                    style={{ width: '-webkit-fill-available', backgroundColor: 'white'  }} 
                                    className='generic-input-control' 
                                    placeholder="Search..."
                                    autoFocus={groupPopover}
                                    autoComplete="off"
                                    onChange={(e)=> setLocalGroup(groupList?.groupList?.filter((group)=> (group.name)?.toLowerCase()?.includes(e.target.value?.toLowerCase())))}
                                    suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                                />
                            </div>

                            <div ref={popoverRef}>
                                {localGroup?.length ? localGroup?.map((gl)=>(
                                    <div 
                                        className={groupInput.name==gl.name? "popoverdataitem popoverdataitem-active": "popoverdataitem"} 
                                        onClick={(e)=>{setGroupInput({name:gl.name, id:gl.key}); setGroupPopover(false)}}>
                                        {gl.name}
                                    </div>
                                )):
                                
                                <div 
                                    className={"popoverdataitem"} 
                                    style={{cursor:'no-drop'}}
                                    onClick={(e)=>{ setGroupPopover(false)}}>
                                    No results found
                                </div>
                                }
                            </div>
                        </div>

                    </div>
                
                        
                        
                  
                </div>
          </Form.Item> 
          : null
          }

        </div>  
      </React.Fragment>  
    </Modal>
  );
};

