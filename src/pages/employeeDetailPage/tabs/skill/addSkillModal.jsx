import { LoadingOutlined } from "@ant-design/icons"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Modal, Spin } from "antd"
import { useCallback, useState } from "react"
import Tesseract from 'tesseract.js';

import { Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';
import "./skill.css";
import Spinner from "../../../../components/spinner"
import axios from "axios"
import { useDispatch } from "react-redux"
import {setNotification} from "../../../../middleware/redux/reducers/notification.reducer"

export const SkillModal = ({visible, onClose, selectedSkill})=>{
    
    const { Dragger } = Upload;

    const [ocr, setOcr] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
  
    const convertImageToText = async (image) => {
        setIsLoading(true);
        Tesseract.recognize(
            image,
            'eng',
            { logger: m => console.log(m) }
          ).then(async({ data: { text } }) => {
            
            const siaNumber = text.slice(0,19).replaceAll(" ","");
            console.log(siaNumber, "nnnnnnnnn",text)
            if(siaNumber >=0 || siaNumber < 0){
                try{

                    const detail = await axios.get("http://localhost:3500/getlicensedetail/"+siaNumber);
                    setOcr(detail?.data?.data);
                }catch(err){
                    dispatch(setNotification({
                        error: true,
                        notificationState: true,
                        message: "No Record Found",
                    }));
    
                    setOcr("");
                }

            }else{
                
                dispatch(setNotification({
                    error: true,
                    notificationState: true,
                    message: "License Number Is Not Clear, Please Try To Get More Clear Picture",
                }));

                setOcr("");

            }
            setIsLoading(false);

        });
    };


    // // 
    const [fileList, setFileList] = useState([]);

    const onDrop = useCallback(acceptedFiles => {
        // Display the image as a preview
        const filePreview = Object.assign(acceptedFiles[0], {
        preview: URL.createObjectURL(acceptedFiles[0])
        });

        setFileList([filePreview]);
        convertImageToText(filePreview);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false
    });

    
    // 

    return(
        <Modal
            open={visible}
            width={450}
            footer={
            <div style={{padding:'6px 40px', paddingBottom:'16px', textAlign:'left', display:'flex', columnGap:'16px', marginTop:'-25px' }}>
                <button  
                    
                    className={isLoading?'disabled-btn drawer-filled-btn' : 'drawer-filled-btn'} 
                >
                    {false? <Spin indicator={<LoadingOutlined/>}/> : "Save"}
                </button>
                <button  disabled={isLoading} className={isLoading ? 'disabled-btn drawer-outlined-btn':'drawer-outlined-btn'} onClick={onClose}>
                    Cancel
                </button>
            </div>
            }
            closable={false}
        >

            <>

                <div className='modal-header-title'>
                    <span style={{letterSpacing:'0.2px'}}>Set {selectedSkill}  </span>
                    <span  onClick={onClose}><FontAwesomeIcon className='close' icon={faClose}/></span>
                </div>
                
                <div className='modal-body'>

                    {/* modal  */}
                    <div>
                        <div {...getRootProps()} className="dropzone">
                            <input {...getInputProps()} />
                            {isLoading?
                                
                                <Spinner/>

                                :

                                fileList?.length>0?
                                        
                                    <img src={fileList[0].preview} alt="preview" style={{ maxHeight: '200px' }} />

                                    :

                                    <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                    </p>
        
                                
                                
                            }
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        </div>
                        
                       
                    </div>
                    {
                        isLoading?
                        null
                        :
                        ocr?
                        <p style={{textAlign:'center'}}>
                            
                            <h3> Extracted Information </h3>
                            
                            <div style={{display:'flex', justifyContent: 'space-between', fontWeight:'500'}}>
                                <b>License Number</b> {ocr?.Licencenumber}
                            </div>
                            
                            <div style={{display:'flex', justifyContent: 'space-between', fontWeight:'500'}}>
                                <b>Status</b>  {ocr?.Status}
                            </div>

                            <div style={{display:'flex', justifyContent: 'space-between', fontWeight:'500'}}>
                                <b>First Name</b>  {ocr?.Firstname}
                            </div>

                            <div style={{display:'flex', justifyContent: 'space-between', fontWeight:'500'}}>
                                <b>Surname</b>  {ocr?.Surname} 
                            </div>

                            <div style={{display:'flex', justifyContent: 'space-between', fontWeight:'500'}}>
                                <b>Expiry Date</b>  {ocr?.Expirydate}
                            </div>

                        </p>: null
                    }


                </div>

            </>

        </Modal>
    )
}