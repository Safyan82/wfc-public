import './draggableTab.css';
import { DndContext, PointerSensor, useSensor } from '@dnd-kit/core';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useEffect, useRef, useState } from 'react';
import { Tabs, Popover, Input, Button } from 'antd';
import dragimg from '../../assets/img/draggable.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { faAdd, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CreateView } from './modal/createView.modal';
import { useMutation, useQuery } from '@apollo/client';
import { BranchViewQuery } from '../../util/query/branchView.query';
import { useDispatch } from 'react-redux';
import { resetAdvanceFilter, resetQuickFilter, setAdvanceFilter, setQuickFilter, setSelectedViewId } from '../../middleware/redux/reducers/quickFilter';
import { updateBranchView } from '../../util/mutation/branchView.mutation';
import { useSelector } from 'react-redux';
import { setRefetchBranchView } from '../../middleware/redux/reducers/branchView.reducer';
import { resetAll } from '../../middleware/redux/reducers/reset.reducer';
import { setTogglenewCreateView } from '../../middleware/redux/reducers/newView.reducer';


const DraggableTabNode = ({ className, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props['data-node-key'],
  });
  const style = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleX: 1,
      },
    ),
    transition,
    cursor: 'pointer',
  };
  return React.cloneElement(props.children, {
    ref: setNodeRef,
    style,
    ...attributes,
    ...listeners,
  });
};
const DraggableTab = ({viewList, refetch, 
  updateView, createViewLoading, createView
}) => {

  const [items, setItems] = useState([]);

  const popoverRef = useRef();
  const inputRef = useRef();


  useEffect(()=>{
    // dispatch(setRefetchBranchView(refetch));
  },[]);

  const [activeKey, setActiveKey] = useState();
  const [createViewForm, setCreateViewForm] = useState(false);
  const [view, setView] = useState([]);
  const [viewSearch, setViewSearch] = useState();
  const [selectedView, setSelectedView] = useState('');
  const [viewPop, setViewPop] = useState();
  const [createdView, setCreatedView] = useState([]);
  
  const dispatch = useDispatch();

  const [pinView, setPinView] = useState();
  
  const handelSelectedView = async(prop)=>{
    dispatch(resetAll());
    const selectedSingleView = viewList?.find((view)=>view._id==prop.id);
    const isExist = items.find((item)=>item.label==prop.label);

    sessionStorage.setItem("selectedViewId", prop?._id)


    setSelectedView(prop.label);
    setPinView(prop.key);
    await updateView({
      variables:{
        input: {
          _id: prop._id,
          isStandard: true,
        }
      }
    });

    if(!isExist){
      setItems([...items, {key: (items.length+1).toString(), label: selectedSingleView?.name, ...selectedSingleView}]);
      setActiveKey((items.length+1).toString());
    }else{
      setActiveKey(isExist.key.toString());
    }

    if(selectedSingleView?.quickFilter){
      dispatch(setQuickFilter(selectedSingleView?.quickFilter));
    }else{
      dispatch(resetQuickFilter());
    }
    if(selectedSingleView?.advanceFilter && selectedSingleView?.advanceFilter?.length>0){
      dispatch(setAdvanceFilter(selectedSingleView?.advanceFilter));
    }else{
      dispatch(resetAdvanceFilter());
    }
  };
 

  useEffect(()=>{
    if(viewList){
      const d = viewList?.filter((item)=>item?.isStandard)?.map((list, index)=>({...list, key: index.toString(), label:list.name, id: list._id}))
        
      setItems(
        viewList?.filter((item)=>item?.isStandard)?.map((list, index)=>({...list, key: index.toString(), label:list.name, id: list._id}))
      );
      setView(viewList?.filter((branchView)=> !branchView?.isManual)?.map((list, index)=>({...list, key: index.toString(), label:list.name, id: list._id})));
      setCreatedView(
        viewList?.filter((branchView)=> branchView?.isManual)?.map((list, index)=>({key: index.toString(), label:list.name, id: list._id, ...list}))
      );
      if(!sessionStorage.getItem('selectedViewId')){
        sessionStorage.setItem("selectedViewId", d[0]?.id);
      
      
        // Handel page load first time to active tab

        dispatch(resetAll());
        setActiveKey('0');
        setPinView('0');

        if(viewList[0]?.quickFilter && Object.keys(viewList[0]?.quickFilter).length>0){
          
          dispatch(setQuickFilter(viewList[0]?.quickFilter));
        }else{
          dispatch(resetQuickFilter());
        }
        if(viewList[0]?.advanceFilter && viewList[0]?.advanceFilter?.length>0){
          dispatch(setAdvanceFilter(viewList[0]?.advanceFilter));
        }else{
          dispatch(resetAdvanceFilter());
        }
      }

    }
  },[viewList])

  const [tabs, setTabs] = useState(
    viewList?.map((list, index)=>({key: index, label:list.name, id: list._id}))
  );



  const sensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 100,
    },
  });

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setItems((prev) => {
        const activeIndex = prev.findIndex((i) => i.key === active.id);
        const overIndex = prev.findIndex((i) => i.key === over?.id);
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
  };

  useEffect(() => {
    // Function to handle clicks outside the box
    const handleClickOutside = (event) => {
      if(event.target.name==="popoverSearch" || event.target.name==="popoverCheckboxes"){ return; }
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        // Perform your desired action here
        setViewPop(false);
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener('click', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const removeView = async (rmItm) => {
    setItems(items?.filter(item=>item.key!=rmItm.key));
    await updateView({
      variables:{
        input: {
          _id: rmItm._id,
          isStandard: false,
        }
      }
    });
    handelActiveTab((Number(items?.length)-1).toString());
  };


  const handelActiveTab = (e)=>{
    console.log(viewList, "viewList", items)
    dispatch(resetAll());
    setActiveKey(e);
    setPinView(e.toString());
    const selectedView = items?.find((view)=>view.key==e.toString());
    
    // dispatch(setSelectedViewId(selectedView?._id));
    sessionStorage.setItem("selectedViewId", selectedView?._id);
    
    if(selectedView?.quickFilter && Object.keys(selectedView?.quickFilter).length>0){
      console.log(selectedView, "selectedSingleView not khali");
      dispatch(setQuickFilter(selectedView?.quickFilter));
    }else{
      console.log(selectedView, "selectedSingleView khali");
      dispatch(resetQuickFilter());
    }
    if(selectedView?.advanceFilter && selectedView?.advanceFilter?.length>0){
      dispatch(setAdvanceFilter(selectedView?.advanceFilter));
    }else{
      dispatch(resetAdvanceFilter());
    }
  }

  // toggle create view from save as option in save btn
  const {togglenewCreateView} = useSelector(state=>state.newViewReducer)
  console.log(togglenewCreateView, "togglenewCreateView");

  return (
    <>
      <div
        className='setting-body-inner' style={{
          padding: '25px 48px 0px', 
          display: 'flex', alignItems:'center'
        }}
      >
        <Tabs       
          closeIcon={true}
          onChange={(e)=>handelActiveTab(e)}
          style={items?.length===3?{minWidth:'35%'}:null}
          renderTabBar={(tabBarProps, DefaultTabBar) => (
            <DndContext sensors={[sensor]} onDragEnd={onDragEnd}>
              <SortableContext items={items.map((i) => i.key)} strategy={horizontalListSortingStrategy}>
                <DefaultTabBar {...tabBarProps}>
                  {(node) => (
                    <DraggableTabNode {...node.props} key={node.key}>
                      {node}
                    </DraggableTabNode>
                  )}
                </DefaultTabBar>
              </SortableContext>
            </DndContext>
          )}
          activeKey={activeKey}
        >
          {items?.map((item)=>(

            <Tabs.TabPane  tab={
              <div className='dragContent'>
                {items?.length>1?
                <>
                  <img src={dragimg} alt="" className='dragimg'/> 
                  <div>{item.label}</div> 
                  <FontAwesomeIcon 
                  style={{marginLeft:'15px',marginRight:'-15px'}} 
                  className={pinView==item.key?'':'dragimg'} icon={faClose} 
                  onClick={()=>removeView(item)}
                  />
                </> : 
                <>
                  <img src={dragimg} alt="" className='dragimg'/> 
                  <div>{item.label}</div>
                </>
                }
              </div>
            } key={item.key} tabKey={item.key} />

          ))}
        </Tabs>
        
        <div className='addView'>                    
            <Popover
                open={viewPop}
                overlayClassName='settingCustomPopover '
                afterOpenChange={()=>{inputRef.current.focus();}}
                style={{ width: 250 }}
                content={
                    viewPop?
                    <div ref={popoverRef}>
                        <div className="popover-search" ref={popoverRef}>
                            <Input type="text" 
                                ref={inputRef}
                                id="inputSearch"
                                name='popoverSearch'
                                style={{ width: '-webkit-fill-available', backgroundColor: 'white'  }} 
                                className='generic-input-control' 
                                placeholder="Search..."
                                autoFocus={viewSearch}
                                autoComplete="off"
                                value={viewSearch}
                                onChange={(e)=> {
                                    setView(viewList?.filter((date)=> (date.name)?.toLowerCase()?.includes(e.target.value?.toLowerCase())))
                                    setViewSearch(e.target.value);
                                }}
                                suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}
                            />
                        </div>
                        
                        <div style={{display:'flex'}}>

                            <div 
                                className="popover-data"  
                                style={{
                                    width: '275px',
                                    overflow: 'auto',
                                    height: '25vh',
                                }}          
                                ref={popoverRef}
                            >
                                <div
                                    style={{
                                        padding: '8px 20px',
                                        color: 'black',
                                        fontWeight: 600,
                                    }}
                                >Standard ({view?.length})</div>
                                {view && view?.map((datelist)=>(

                                    <div 
                                        style={{paddingLeft:'40px'}}
                                        className={selectedView==datelist.label? 
                                        "popoverdataitem popoverdataitem-active": "popoverdataitem"} 
                                        onClick={(e)=>{handelSelectedView(datelist);  setViewPop(false)}}>
                                        {datelist?.label}
                                    </div>
                                ))}
                            </div>
                            {createdView?.length>0?
                            <div      
                                className="popover-data"  
                                style={{
                                    width: '275px',
                                    overflow: 'auto',
                                    height: '25vh',
                                }}          
                                ref={popoverRef}
                            >
                                <div
                                    style={{
                                        padding: '8px 20px',
                                        color: 'black',
                                        fontWeight: 600,
                                    }}
                                >Created by me ({createdView?.length})</div>
                                {createdView && createdView?.map((datelist)=>(

                                    <div 
                                        style={{paddingLeft:'40px'}}
                                        className={selectedView==datelist.label? "popoverdataitem popoverdataitem-active": "popoverdataitem"} 
                                        onClick={(e)=>{handelSelectedView(datelist); setViewPop(false)}}>
                                        {datelist.label}
                                    </div>
                                ))}
                            </div>
                            : null
                            }
                        </div>

                        {/* footer */}
                        <div className="addViewfooter" ref={popoverRef} onClick={()=>setCreateViewForm(true)}>
                            <span>Create a new view</span>
                        </div>

                    </div>
                    : null
                    }
                    trigger="click"
                    placement='bottom'
                >
                  <Button type='text' ref={popoverRef}  onClick={()=>{setViewPop(!viewPop)}}> <FontAwesomeIcon icon={faAdd} color='#7c98b6' /> &nbsp; Add view ({items?.length}/5)</Button>
            </Popover>

            <Button type='text'>All views </Button>

        </div>
      </div>
      
      <CreateView
            visible={createViewForm || togglenewCreateView}
            onClose={()=>{setCreateViewForm(false); dispatch(setTogglenewCreateView(false))}}
            setcreatedView = {setCreatedView}
            createdView={createdView}
            branchViewRefetch={refetch}
            createView= {createView}
            createViewLoading = {createViewLoading}
      />
    </>
  );
};
export default DraggableTab;