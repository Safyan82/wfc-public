import './formView.css';
import { FormHeader } from "../../components/header/header";
import { Input } from 'antd';

export const FormView = ()=>{
    return(
        <>
        
            <FormHeader
                title={"Preview Branch Form"}
                btnVisibility={false}
                url="/user/branch"
            />

            <div className="form-view-inner">
                <div className="form-view-body">
                    <div className="form-view-header">
                        <div className="h2">Review what users will see</div>
                    </div>

                    <div className="spacer">
                        <div className="form-view">

                            <div className="form-head-btn">
                                <span className='btn-skt'></span>
                            </div>
                            <div className="form-view-innerheader">
                                <div className="form-view-innerheader-wrap" >
                                    Create Branch 
                                </div>
                            </div>

                            <div className="form-view-inner-body">
                                <label className='form-view-label'>Email</label>
                                <Input className="generic-input-control" disabled/>
                            </div>

                            {/* footer */}

                            <div className="form-view-footer">
                                <div className="form-view-btn-layout">
                                    <div className="form-view-btn-layout-btn">
                                        <div className="btn-inner"></div>
                                    </div>
                                    <div className="form-view-btn-layout-btn">
                                        <div className="btn-inner"></div>
                                    </div>
                                    <div className="form-view-btn-layout-btn">
                                        <div className="btn-inner"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
};