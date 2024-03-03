import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './rightsidebar.css';
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { faMobile, faMobileAndroidAlt, faPhone, faPlus, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import noData from '../noData.svg';
import { Guage } from './guage';

export const DetailPageRightSideBar = () => {
  const [items, setItems] = useState([
    { id: '1', content: 
    <div className='rightItem'>
        Last duty performed never
    </div> 
    },
    
    { id: '2', content: 
    <div className='rightItem'>
        <FontAwesomeIcon icon={faMobileAndroidAlt} style={{marginRight:'2%'}}/> 
        Last seen now
    </div> 
    },

    { id: '3', content: 
    <div className='rightItem'>
        <b style={{letterSpacing:'1px',marginBottom:'5%', display:'flex', justifyContent:'space-between', alignItems:'center', }}>Emergency Contacts <FontAwesomeIcon style={{cursor: 'pointer'}} icon={faPlus}/></b>
        <p className="overview-body" style={{textAlign:'center', }}>
            <img src={noData} width={100}/>
            <p className="text">There is no contact.</p>
        </p>
    </div> 
    },

    { id: '4', content: 
    <div className='rightItem'>
        <b style={{letterSpacing:'1px',marginBottom:'5%', display:'flex', justifyContent:'space-between', alignItems:'center', }}>Calls</b>
        <p style={{display: 'flex', columnGap: '10px', alignItems:'center'}}>
            <p className="callItem">
                <b>0</b>
                <span>Total</span>
            </p>
            <p className="callItem">
                <b>0</b>
                <span>Auto</span>
            </p>
            <p className="callItem">
                <b>0</b>
                <span>Manual</span>
            </p>
            <b style={{fontSize:'15px'}}>0.00 %</b>
        </p>
        <p style={{marginBottom:'0%'}}>No call found for 7 days.</p>
    </div> 
    },

    
    { id: '5', content: 
    <div className='rightItem'>
        <b style={{letterSpacing:'1px', zIndex:99999999999999999999 }}> Skills</b>
        <p style={{textAlign:'center', display:'flex', justifyContent:'space-between', width:'100%', height:'120px', alignItems:'center'}}>
            <Guage/>
            <Guage/>
            <Guage/>
        </p>
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
    <div className="emp-rightsidebar-wrapper"  style={{background:'rgb(245, 248, 250)'}}>
        <DragDropContext onDragEnd={onDragEnd}>
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
                        className='rightSideItem'
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
      <div style={{ border: '1px solid #ccc', padding: '8px', margin: '4px', backgroundColor: 'lightgray' }}>
        {content}
      </div>
    );
};
