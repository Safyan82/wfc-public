import React, { useContext, useEffect, useRef, useState } from 'react';
import { Tabs, Form, Input, Popconfirm, Table } from 'antd';
import TabPane from "antd/es/tabs/TabPane"

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} className='generic-input-control' onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
        //   paddingRight: 24,
          color:'blue', textDecoration:'underline', cursor:'poiner'
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

export const PayTable = ({themeData})=>{

    const [newPayLevelModal, setNewPayLevelModal] = useState(false);
    const [dataSource, setDataSource] = useState([
        {
          key: '0',
          payLevel:'Security',
          name: '0',
        },
    ]);
    
    const [count, setCount] = useState(2);


    const defaultColumns = [
        {
          title: '',
          dataIndex: 'payLevel',
          width: '10%',
        },
        {
          title: 'Regular pay',
          dataIndex: 'name',
          editable: true,
        },
    ];

    const handleSave = (row) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record) => ({
            record,
            editable: col.editable,
            dataIndex: col.dataIndex,
            title: col.title,
            handleSave,
          }),
        };
    });


    return(
        <div className='setting-body'>
            <div className='setting-body-inner'>
                <div className="setting-body-inner">
                    <div className="setting-body-title">
                        <div className='setting-body-inner-title'>
                            Pay Table
                        </div>
                    </div>

                    <div className="text">
                        Pay and Bill columns will be settle in shift type and pay table.
                    </div>


                    {/* body */}

                    <div className="propertyTab"></div>
                    <Tabs defaultActiveKey="1" >
                        <TabPane tab={`Pay Table Details`} key="1" >
                            <div>
                                {/* search header */}
                                <div style={{display:'flex', justifyContent:'flex-end', alignItems:'center'}}>
                                        <button className="drawer-filled-btn" onClick={()=>setNewPayLevelModal(!newPayLevelModal)}>Add</button>
                                </div>

                                {/* subscription main body cards */}
                                <div className="propertyTab"></div>

                                <Table
                                    components={components}
                                    rowClassName={() => 'editable-row'}
                                    bordered
                                    dataSource={dataSource}
                                    columns={columns}
                                />

                            </div>
                        </TabPane>
                    </Tabs>


                </div> 

                             
            </div>
        </div>
        
    )
}