import React, { useContext, useEffect, useRef, useState } from 'react';
import { Tabs, Form, Input, Popconfirm, Table } from 'antd';
import TabPane from "antd/es/tabs/TabPane"
import { getPayandBillColumnQuery } from '@src/util/query/payandbillColumn.query';
import { useMutation, useQuery } from '@apollo/client';
import { getPayLevelQuery } from '@src/util/query/paylevel.query';
import { getAgencyPayTableQuery } from '../../../util/query/agencyPayTable.query';
import { upsertAgencyPayTableMutation } from '../../../util/mutation/agencyPayTable.mutation';

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
        style={{margin:0, padding:0}}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input type='number' ref={inputRef} className='generic-input-control' onPressEnter={save} 
          onBlur={save} 
        />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
        //   paddingRight: 24,
          color:'blue', cursor:'pointer'
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

export const AgencyPayTable = ({id})=>{


    const [remoteColumns, setRemoteColumns] = useState([]);

    const {data, loading:getPayandBillColumnLoading, refetch} = useQuery(getPayandBillColumnQuery);
    
    useEffect(()=>{
      if(data?.getPayandBillColumn?.response){
        setRemoteColumns([
          {
            title: '',
            dataIndex: 'payLevel',
            width: '20%',
          },
          ...data?.getPayandBillColumn?.response?.map((col)=>(
            {
              title: col?.columnName,
              dataIndex: col?._id,
              editable: true,
              // width:'20%'
            }
          ))
        ]);
      }
    },[data?.getPayandBillColumn?.response]);

    
    const {data: payLevel, loading: payLevelLoading} = useQuery(getPayLevelQuery,{
      fetchPolicy: 'network-only',
    });

    const [dataSource, setDataSource] = useState([]);

    const {data: agencyPayTableData, loading: agencyPayTableLoading} = useQuery(getAgencyPayTableQuery,{
      variables:{
        agencyId: id
      },
      fetchPolicy:'network-only'
    })

    useEffect(()=>{
      setDataSource(payLevel?.getPayLevel?.response?.map((pl)=>{
        
        const columns = data?.getPayandBillColumn?.response?.map((col)=>(col?._id));
        const resultObject = {};
        
        const payLevelData = agencyPayTableData?.getAgencyPayTable?.response;

        for (let i = 0; i < columns?.length; i ++) {
          const payLevelColData = payLevelData?.find((pld)=>pld?.payLevelId===pl?._id);
          resultObject[columns[i]] =  payLevelColData?.payTableMeta?.hasOwnProperty([columns[i]])? payLevelColData?.payTableMeta[columns[i]] : 0;
        }

        return({
          key:pl?._id,
          payLevel: pl?.name,
          ...resultObject,
          payLevelId: pl?._id
        })

      }))
    },[payLevel, agencyPayTableData?.getAgencyPayTable?.response]);

    const [upsertAgencyPayTable, {loading: upsertAgencyPayTableLoading}] = useMutation(upsertAgencyPayTableMutation);

    const handleSave = async(row) => {

        const {payLevel, key, payLevelId, ...rest} = row;

        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setDataSource(newData);

        await upsertAgencyPayTable({
          variables:{
            input: {
              agencyId: id,
              payLevelId,
              payTableMeta: rest
            }
          }
        })
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = remoteColumns.map((col) => {
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
        <div style={{padding:'12px 16px'}}>
            <div className="setting-body-title">
                <div className='setting-body-inner-title'>
                    Pay Table
                </div>
            </div>

            <div className="text">
                This is the customer pay table that will be use if there's no pay set in site group.
            </div>


            <Table
                components={components}
                className='payTable'
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
            />

                           


        </div> 

        
    )
}