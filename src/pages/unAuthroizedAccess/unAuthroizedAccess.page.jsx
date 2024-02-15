import { Navbar } from '../../components/navbar';
import error from './assets/unauth.svg';

export const UnAuthroizedAccess = ()=>{
    return(
        <>
            {/* <Navbar/> */}
            <div style={{display:'flex', alignItems:'center', flexDirection:'column', alignContent:'center', justifyContent:'center', height:'90vh'}}>
                    <img width={200} height={200} src={error} alt="" />
                    <div>
                        <h4>That page is nowhere to be found</h4>
                        <hr/>
                        <div className="text">Try the following troubleshooting steps:</div>
                        <ol
                            style={{
                                padding: '0 15px',
                                fontSize: '11px',
                                lineHeight: '25px',
                            }}  
                        >
                            <li>You might be don't have access of this link</li>
                            <li>This link might be expired</li>
                        </ol>
                    </div>
            </div>
        </>
    )
}