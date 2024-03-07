import React, { useEffect, useState } from 'react';
import { Layout, theme, Table, Input, Popover } from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import TabsComponent from '../tab';
import { Loader } from '../loader';
import { GetBranchObject } from '../../util/query/branch.query';
import { useQuery } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faSearch } from '@fortawesome/free-solid-svg-icons';
import './table.css';
  
import { Resizable } from 'react-resizable';
import { EditColumn } from './editColumn/editColumn.modal';
import { SingleBranchViewQuery } from '../../util/query/branchView.query';
import { useDispatch } from 'react-redux';
import { refreshBranchGrid } from '../../middleware/redux/reducers/branch.reducer';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setEditGridColumn } from '../../middleware/redux/reducers/properties.reducer';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { EditPropertiesModal } from './modal/editproperty.modal';
const { Header, Content, Footer } = Layout;

export const DataTable = ({
  header, data, loading, 
  setDynamicColumn, 
  dynamicColumn, objectData,
  viewRefetch, view, detailpage, handelBulkUpdateSave}) => {

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  
  useEffect(()=>{
    if(objectData?.length>0 && view ){
      const mandatoryField = objectData?.filter((prop)=>  prop?.isReadOnly);
      // const viewProp = view.filter((viewProp)=> objectData?.find((object)=> object.propertyId == viewProp?._id))?.map((prop)=> ({propertyDetail: prop}));
      const viewProp = view?.map((prop)=> ({propertyDetail: prop}));
      const updateView = [...mandatoryField, ...viewProp];
      // const col = objectData?.filter((prop)=>  prop?.isReadOnly || view?.find((viewProp)=>viewProp?._id==prop?.propertyId)).map((prop)=>{
      const col = updateView.map((prop)=>{
        // if(prop.propertyDetail.label=="Branch name" || prop.propertyDetail.label=="Post code"){
          
          return {
            originalObj: prop,
            title: prop.propertyDetail.label,
            dataIndex: prop.propertyDetail.label.replaceAll(" ","").toLowerCase(),
            key: prop.propertyDetail.label.replaceAll(" ","").toLowerCase(), // Initial width of the column
            width: 100,
            onHeaderCell: (column) => ({
              width: column.width,
              onResize: handleResize(column.dataIndex),
              ellipsis: true
            }),
            ellipsis: true,

            render: (_, record) => {
              const showActions = sessionStorage.getItem('hoverItem') == record.key && prop.propertyDetail.label == objectData[0].propertyDetail.label &&  selectedRowKeys?.length===0;
              if(prop.propertyDetail.label.replaceAll(" ","").toLowerCase()=="phonenumber"
              ){
                return(
                  <a style={{textDecoration:'underline'}} href={"tel:"+record[prop.propertyDetail.label.replaceAll(" ","").toLowerCase()]}>
                    {record[prop.propertyDetail.label.replaceAll(" ","").toLowerCase()]}
                  </a>
                )
              }
              else if(prop.propertyDetail.label.replaceAll(" ","").toLowerCase()=="email"
              ){
                return(
                  <a style={{textDecoration:'underline'}} target='_blank' href={"mailto:"+record[prop.propertyDetail.label.replaceAll(" ","").toLowerCase()]}>
                    {record[prop.propertyDetail.label.replaceAll(" ","").toLowerCase()]}
                  </a>
                )
              }
              else{
              return (          
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between',}}>
                  
                  <div 
                    onClick={()=>history('/user/'+detailpage+record.key)}
                    className={showActions? 'prev-btn' : null}
                    style={prop.propertyDetail.label.replaceAll(" ","").toLowerCase()=="firstname" || prop.propertyDetail.label.replaceAll(" ","").toLowerCase()=="branchname"?{color:'#0091ae'}:{}}
                  >
                    {record[prop.propertyDetail.label.replaceAll(" ","").toLowerCase()]}
                  
                  </div>
                    
  
                

                  <button className={"grid-sm-btn"} style={showActions?{visibility: 'visible'}:{visibility: 'hidden'}} type="link" onClick={()=>history('/user/'+detailpage+record.key)}>
                    Preview
                  </button>
                
              </div>
              );
              }
            },
          }
        // }
      })||[];
      setDynamicColumn([...col]);
      dispatch(refreshBranchGrid(false));
    }else if(objectData?.length>0 && view==false){
      const col = objectData.map((prop)=>{
        // if(prop.propertyDetail.label=="Branch name" || prop.propertyDetail.label=="Post code"){
          
          return {
            originalObj: prop,
            title: prop.propertyDetail.label,
            dataIndex: prop.propertyDetail.label.replaceAll(" ","").toLowerCase(),
            key: prop.propertyDetail.label.replaceAll(" ","").toLowerCase(), // Initial width of the column
            width: 100,
            onHeaderCell: (column) => ({
              width: column.width,
              onResize: handleResize(column.dataIndex),
              ellipsis: true
            }),
            ellipsis: true,

            render: (_, record) => {
              const showActions = sessionStorage.getItem('hoverItem') == record.key && prop.propertyDetail.label == objectData[0].propertyDetail.label &&  selectedRowKeys?.length===0;
              if(prop.propertyDetail.label.replaceAll(" ","").toLowerCase()=="phonenumber"
              ){
                return(
                  <a style={{textDecoration:'underline'}} href={"tel:"+record[prop.propertyDetail.label.replaceAll(" ","").toLowerCase()]}>
                    {record[prop.propertyDetail.label.replaceAll(" ","").toLowerCase()]}
                  </a>
                )
              }
              else if(prop.propertyDetail.label.replaceAll(" ","").toLowerCase()=="email"
              ){
                return(
                  <a style={{textDecoration:'underline'}} target='_blank' href={"mailto:"+record[prop.propertyDetail.label.replaceAll(" ","").toLowerCase()]}>
                    {record[prop.propertyDetail.label.replaceAll(" ","").toLowerCase()]}
                  </a>
                )
              }
              else{
              return (          
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between',}}>
                  
                  <div 
                    onClick={()=>history('/user/'+detailpage+record.key)}
                    className={showActions? 'prev-btn' : null}
                    style={prop.propertyDetail.label.replaceAll(" ","").toLowerCase()=="firstname" || prop.propertyDetail.label.replaceAll(" ","").toLowerCase()=="branchname" || prop.propertyDetail.label.replaceAll(" ","").toLowerCase()=="sitegroupname"?{color:'#0091ae'}:{}}
                  >
                    {record[prop.propertyDetail.label.replaceAll(" ","").toLowerCase()]}
                  
                  </div>
                    
  
                

                  <button className={"grid-sm-btn"} style={showActions?{visibility: 'visible'}:{visibility: 'hidden'}} type="link" onClick={()=>history('/user/'+detailpage+record.key)}>
                    Preview
                  </button>
                
              </div>
              );
              }
            },
          }
        // }
      })||[];
      setDynamicColumn([...col]);
    }
  }, [objectData, view]);



  const handleResize = dataIndex => (e, { size }) => {
    setDynamicColumn(prevColumns => {
      const nextColumns = [...prevColumns];
      const index = nextColumns.findIndex(col => col.dataIndex === dataIndex);
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return nextColumns;
    });
  };

  const dispatch = useDispatch();
  const branchReducer = useSelector(state => state.branchReducer);

  useEffect(()=>{
    if(branchReducer?.refreshGrid){

      viewRefetch();
    }
  },[branchReducer?.refreshGrid]);
  
  const [hoveredRow, setHoveredRow] = useState(null);

  const rowClassName = (record) => {
    return record.key === hoveredRow ? 'hovered-row' : '';
  };

  
  
  const handleRowMouseEnter = (record) => {
    setHoveredRow(record.key);
    sessionStorage.setItem('hoverItem', record.key);
  };


  const handleRowMouseLeave = () => {
    setHoveredRow(null);
    // setMoreoption(false);
    sessionStorage.removeItem('hoverItem');

  };

  const history = useNavigate();

  const [dataSource, setDataSource] = useState([]);

  
  useEffect(()=>{
    setDataSource(data?.map((key,index) => {
      const {metadata, ...rest} = key;
      return {key:key?._id ,...metadata, ...rest};
    }));
  },[data]);


  const [search, setSearch] = useState("");

  useEffect(()=>{
    if(search?.value?.length>0){

      setDataSource(data?.map((key,index) => {
        const {metadata, ...rest} = key;
        return {key:key?._id ,...metadata, ...rest};
      })?.filter((data)=> Object.values(data).includes(search)));
    }else{
      setDataSource(data?.map((key,index) => {
        const {metadata, ...rest} = key;
        return {key:key?._id ,...metadata, ...rest};
      }));
    }
  },[search]);


  const {
    token: { colorBgContainer },
  } = theme.useToken();
  
  const handleChange = (pagination, filters, sorter) => {};


  const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
  };


  // normal row selection
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };


  const [propertyModal, setPropertyModal] = useState(false);

  return (
    <Layout className='bg-white'>
      <Content className="site-layout" style={{ padding: '0 42px' }}>
        <div style={{ padding: 5, minHeight: 450, background: colorBgContainer }}>
            {/* <TabsComponent/> */}
            {loading?
            <Loader/>
            :

            <Table  
              bordered
              rowSelection={rowSelection}
              columns={dynamicColumn} 
              // className={selectedRowKeys?.length>0? 'commonGrid generalGrid' : 'generalGrid'}
              components={{
                header: {
                  cell: ResizableTitle,
                },
              }}
              dataSource={dataSource} 
              
              title={
                                
                !header? null : () => {
                  if(header){
                  return(
                    <div className='grid-table-search-input'>
                    
                      <div className='table-footer' id="selection-options">
                        <Input type='search' onChange={(e)=>setSearch(e.target.value)} style={{background: 'white', width:'250px', height:'33px'}} className='generic-input-control' placeholder='Search ...'  suffix={<FontAwesomeIcon style={{color:'#0091ae'}}  icon={faSearch}/>}/>
                        {selectedRowKeys?.length>0 &&
                          <>
                              <small class='small-text'> {selectedRowKeys?.length} selected</small>

                              <div onClick={()=>setPropertyModal(!propertyModal)}>
                                  <FontAwesomeIcon icon={faPencil} style={{marginRight:'5px'}}/> <span>Edit</span>
                              </div>

                              {/* <div >
                                  <FontAwesomeIcon icon={faTrashCan} style={{marginRight:'5px'}}/> <span>Delete</span>
                              </div> */}

                          </>
                        }
                      </div>
                      
                      
                      <div className="small-btn">
                        <button className='sm-btn'>Export</button> &emsp;
                        <button className='sm-btn' onClick={()=>dispatch(setEditGridColumn(true))}>Edit columns</button>
                      </div>
                    </div>
                  )}else{return null}
                  }
              } 
              
          
              onRow={(record) => ({
                onMouseEnter: () => handleRowMouseEnter(record),
                onMouseLeave: () => handleRowMouseLeave(),
              })}
              rowClassName={rowClassName}
            />
            }
        </div>

{/* bulk edit properties modal */}
{propertyModal?
        <EditPropertiesModal
          visible={propertyModal}
          onClose={()=>setPropertyModal(!propertyModal)}
          record={selectedRowKeys}
          clearSelection = {setSelectedRowKeys}
          dynamicColumn={dynamicColumn}
          handelBulkUpdateSave={handelBulkUpdateSave}
        />
:null}
      
      </Content>
      
    </Layout>
  );
};

const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={<span className="react-resizable-handle" />}
      onResize={onResize}
    >
      <th {...restProps} />
    </Resizable>
  );
};