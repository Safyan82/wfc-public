import form from "@src/assets/img/forms.svg";
import { useLocation, useNavigate } from "react-router-dom"
import { routes } from '@src/util/routes/routes.js';

export const Module = ()=>{

    const location = useLocation();
    const module = location?.search?.slice(1);

    const navigate = useNavigate();
    console.log(routes?.propertySetting+"?field="+module, "routes", module);

    return(
        
        <div className="setting-body">
        <div className="setting-body-inner">
            <div className='setting-body-inner'>
                <div className="setting-body-title">
                    <div className='setting-body-inner-title'>
                        {module[0].toUpperCase()+module.slice(1)}
                    </div>
{/* 
                    <div className='btn-group'>
                        <button className='btn-transparent'>
                            <FontAwesomeIcon icon={faLock}/> &nbsp; <span className='text-decore'>Data Quality</span>
                        </button>
                        <Button className='setting-filled-btn'>
                            Export all data fields
                        </Button>
                    </div> */}
                </div>
                <div className="text" style={{padding:'10px 0',}}>
                    Manage the information you collect and store about your {module}.
                </div>
                
                <hr style={{backgroundColor:'rgb(223, 227, 235)', margin:'24px 0', height:'1px', border:0}}/>

                <h4 style={{fontSize:'16px', fontWeight:'600'}}>Setup</h4>
                <div style={{marginBottom:'32px'}}>
                    <h4 style={{fontSize:'14px', fontWeight:'600', color:'#0091ae', marginBottom:'0', cursor:'pointer'}} 
                        onClick={()=>navigate(routes?.propertySetting+"?field="+module)}
                    > Manage {module} data fields</h4>
                    <div className="text">Manage the information you collect about your {module}.</div>
                </div>

                <div>
                    <h4 style={{fontSize:'16px', fontWeight:'600'}}>
                        Creating {module}
                    </h4>

                    <div style={{display:'flex', gap:'20px', alignItems:'center'}}>
                        <img src={form} height={60}/>
                        <span>
                            <h4 style={{fontSize:'14px', fontWeight:'600', color:'#0091ae', margin:'0', cursor:'pointer'}}
                                onClick={()=>navigate(routes?.forms+"?field="+module)}
                            > 
                            Customise the {module} form </h4>
                            <div className="text">Add, remove, or edit fields on the '{module}' form</div>
                        </span>
                    </div>
                </div>

            </div>
        </div>
        </div>
    )
}