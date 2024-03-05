import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './rightsidebar.css';
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {faMobileAndroidAlt, faPlus} from '@fortawesome/free-solid-svg-icons';
import { Popover, Progress } from 'antd';

export const DetailPageRightSideBar = () => {
  const [items, setItems] = useState([
    
    { id: '1', content: 
    <div className='rightSideItem'>
        <div style={{fontWeight:'500', fontSize:'14px', marginBottom:'12px', paddingBottom:'10px', borderBottom:'1px solid #ECEFEC'}}>Recent Availability</div>
        <div className='rightItem'>
            Last seen now
            <FontAwesomeIcon icon={faMobileAndroidAlt} style={{marginRight:'2%'}}/> 
        </div> 
    </div>
    },

    { id: '2', content: 
    <div className='rightSideItem'>
        <div style={{fontWeight:'500', fontSize:'14px', marginBottom:'12px', paddingBottom:'10px', borderBottom:'1px solid #ECEFEC'}}>Last Post by You</div>
        
        <div className='rightItem'>
            <span>First Aid</span>  
            <span>02-09-2023</span>      
        </div> 

        <div className='rightItem'>
            <span>XYZ Site Instruction</span>  
            <span>02-09-2023</span>  
        </div> 
    </div>
    },
    
    { id: '3', content: 
    <div className='rightSideItem'>
        <div style={{fontWeight:'500', fontSize:'14px', marginBottom:'12px', paddingBottom:'10px', borderBottom:'1px solid #ECEFEC', display:'flex', justifyContent:'space-between'}}>
            <span>Emergency Contact information</span>
            <Popover
                content={"Click to add emergency contacts"}
            >
                <FontAwesomeIcon icon={faPlus} style={{cursor:'pointer', marginRight:'10px'}}/>
            </Popover>
        </div>
        
        <div className='rightItem'>
            <span>Relationship</span>  
            <span>Father</span>      
        </div> 

        <div className='rightItem'>
            <span>Mobile Number</span>  
            <span>07904259391</span>  
        </div> 
    </div>
    },

    
    { id: '4', content: 
    <div className='rightSideItem'>
        <div style={{fontWeight:'500', fontSize:'14px', marginBottom:'12px', paddingBottom:'10px', borderBottom:'1px solid #ECEFEC'}}>Status</div>
        <div className='rightItem'>
            <span>Job Status</span>

            <div style={{width:'30%', display:'flex',flexDirection:'column', alignItems:'center'}}>
                <span>Active</span>
                <Progress
                    showInfo={false}
                    percent={100}
                    success={{
                      percent: 100,
                    }}
                    trailColor="red"
                    strokeColor="red"
                />
            </div>
        </div> 

        <div className='rightItem'>
            <span>SIA Licence Validity</span>

            <div style={{width:'30%', display:'flex',flexDirection:'column', alignItems:'center'}}>
                <span>01-10-2025</span>
                <Progress
                    showInfo={false}
                    percent={60}
                    success={{
                      percent: 60,
                    }}
                    trailColor="red"
                    strokeColor="red"
                />
            </div>
        </div>
        
        <div className='rightItem'>
            <span>Health & Saftey Validity</span>

            <div style={{width:'30%', display:'flex',flexDirection:'column', alignItems:'center'}}>
                <span>01-10-2025</span>
                <Progress
                    showInfo={false}
                    percent={100}
                    success={{
                      percent: 100,
                    }}
                    trailColor="red"
                    strokeColor="red"
                />
            </div>
        </div>

    </div>
    },


  ]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newItems = [...items];
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  return (
    <div className="emp-rightsidebar-wrapper">
     
        <DragDropContext onDragEnd={onDragEnd} >
        <Droppable droppableId="items">
            {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
                {items.map((item, index) => (
                <Draggable  key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        // className='rightSideItem'
                    >
                        <DraggableItem content={item.content} />
                    </div>
                    )}
                </Draggable>
                ))}
                {provided.placeholder}
            </div>
            )}
        </Droppable>
        </DragDropContext>
    </div>
  );
};
const DraggableItem = ({ content }) => {
    return (
      <div >
        {content}
      </div>
    );
};
