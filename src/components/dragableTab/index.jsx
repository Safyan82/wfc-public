import React from 'react';
import { Tabs } from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const { TabPane } = Tabs;

const TabItem = ({ id, index, moveTab, ...props }) => {
  const ref = React.useRef(null);

  const [, drag] = useDrag({
    item: { id, index, type: 'TabItem' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TabItem',
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveTab(dragIndex, hoverIndex, item.id);

      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return <div ref={ref} {...props} />;
};

const DraggableTabs = () => {
  const [tabs, setTabs] = React.useState([
    { key: '1', title: 'Tab 1' },
    { key: '2', title: 'Tab 2' },
    { key: '3', title: 'Tab 3' },
  ]);

  const moveTab = (dragIndex, hoverIndex, id) => {
    const newTabs = [...tabs];
    const dragTab = newTabs.find((tab) => tab.key === id);
    newTabs.splice(dragIndex, 1);
    newTabs.splice(hoverIndex, 0, dragTab);
    setTabs(newTabs);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Tabs type="editable-card">
        {tabs.map((tab, index) => (
          <TabPane
            key={tab.key}
            tab={
              <TabItem id={tab.key} index={index} moveTab={moveTab}>
                {tab.title}
              </TabItem>
            }
          >
            {tab.title} content
          </TabPane>
        ))}
      </Tabs>
    </DndProvider>
  );
};

export default DraggableTabs;
