import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ApartmentOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft, faEdit, faTrash, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Popover } from "antd";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  localStorage.setItem("branchOrder", JSON.stringify(result))
  return result;
};



export default class DraggableList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: this.props.list
    };
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    console.log(result);
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {this.state.items.map((item, index) => (
                <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}
                 
                >
                  {(provided, snapshot) => (
                    <div className="icon-wrapper">
                      <div className="delete-icon">
                        <Popover 
                          overlayClassName="custom-popover"
                          content={"This Property is a part of object schema"} 
                          placement='top'
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </Popover>
                        
                        <Popover 
                          overlayClassName="custom-popover"
                          content={"Conditional logic is not available for non-enumerated properties."} 
                          placement='top'
                        >
                          <ApartmentOutlined />
                        </Popover>

                        
                        <Popover 
                        overlayClassName="custom-popover"
                        content={"Change the label of this property"} 
                        placement='top'
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Popover>

                      </div>
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        id={"item-"+index}
                        itemRef={"item-"+index}
                        key={item.id}
                        className="edit-form-input-control input inputItemList"
                        style={{
                          opacity: snapshot.isDragging ? 0.5 : 1,
                          ...provided.draggableProps.style
                        }}
                      >
                          {item.content}
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
}