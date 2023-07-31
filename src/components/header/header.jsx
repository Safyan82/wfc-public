import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom"
import Spinner from "../spinner";

export const FormHeader = (
    {loading, btnDisabled,btnVisibility, setModalState, modalState, handelSave, url, title}
    )=>{
    const navigate = useNavigate();
    return( 
        <section className="section">
            <div className="toolbar">
                <div className="toolbar-inner">
                    <div className="toolbar-inner-link"  onClick={()=>navigate(url)}>
                        <div><FontAwesomeIcon icon={faChevronLeft} style={{fontSize:'20px'}} /></div>
                        <div>Back</div>
                    </div>
                    <div className="toolbar-inner-title">{title}</div>
                    <div className="btn-group" style={btnVisibility? null : {visibility:'hidden'}}>
                        <button disabled={loading} className={loading?"drawer-outlined-btn disabled-btn": "drawer-outlined-btn"} onClick={()=>setModalState(!modalState)}>Preview</button>
                        <button disabled={loading || btnDisabled} className={loading || btnDisabled? "drawer-filled-btn disabled-btn":"drawer-filled-btn "} onClick={handelSave}> {loading? <Spinner/> : "Save"}</button>
                    </div>
                </div>
            </div>
        </section>
    )
}