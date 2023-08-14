import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ApartmentOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk, faDeleteLeft, faEdit, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Popover } from "antd";
import { addFieldToBranchSchema, removeFieldFromBranchSchema, setPropertyToBeRemoveFromSchema } from "../../middleware/redux/reducers/branch.reducer";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { ReorderBranchSchema } from "../../util/mutation/branch.mutation";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};



const DraggableList = ({list}) => {
  //  console.log(list, "safyan listtt");
  const [reorderBranchSchema,{loading: rearragementLoading}] = useMutation(ReorderBranchSchema);

  const [items, setItems] = useState(list)
  useEffect(()=>{
    setItems(list?.filter((l)=>l.isLocalDeleted!=1));
  }, [list]);

  useEffect(()=>{
   
    console.log(items, "itemm");
  },[items]);

  const onDragEnd = async (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    

    setItems(reorder(
      items,
      result.source.index,
      result.destination.index
    ));

    await reorderBranchSchema({
      variables:{
        input:{fields: reorder(
          items,
          result.source.index,
          result.destination.index
        ).map((item)=>({propertyId: item._id}))}
      }
    });

  }


  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  const dispatch = useDispatch();
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {items.map((item, index) => (
                item?.isLocalDeleted ? null :
                <Draggable key={item._id} draggableId={item._id} index={index}
                 
                >
                  {(provided, snapshot) => (
                    <div className="icon-wrapper">
                      <div className="delete-icon">
                        {/* <Popover 
                          overlayClassName="custom-popover"
                          content={"This Property is a part of object schema"} 
                          placement='top'
                        > */}
            
                          <FontAwesomeIcon onClick={async()=>{
                            await dispatch(setPropertyToBeRemoveFromSchema(item._id));
                            }} className="active" icon={faTrashAlt} />
                        {/* </Popover> */}
                        
                        {/* <Popover 
                          overlayClassName="custom-popover"
                          content={"Conditional logic is not available for non-enumerated properties."} 
                          placement='top'
                        > */}
                          <ApartmentOutlined />
                        {/* </Popover> */}

                        
                        {/* <Popover 
                        overlayClassName="custom-popover"
                        content={"Change the label of this property"} 
                        placement='top'
                        > */}
                          <FontAwesomeIcon 
                            className={item?.isMandatory? "mandatory" : "active"} 
                            icon={faAsterisk} 
                            onClick={()=>dispatch(addFieldToBranchSchema({_id:item._id, isMandatory: item?.isMandatory ? false : true}))} 
                          />
                        {/* </Popover> */}

                      </div>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        id={"item-"+index}
                        itemRef={"item-"+index}
                        key={item._id}
                        className="edit-form-input-control input inputItemList"
                        style={{
                          opacity: snapshot.isDragging ? 0.5 : 1,
                          ...provided.draggableProps.style
                        }}
                      >
                        <span className="text">{item.label}</span>  
                      </div>
                    </div>

                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
}

export default DraggableList;