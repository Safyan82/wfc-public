import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { FormView } from "../../pages/formView/formView";
import { useEffect, useLayoutEffect, useState } from "react";
import Spinner from "../../components/spinner";
import { useDispatch } from "react-redux";
import { resetAll } from "../../middleware/redux/reducers/reset.reducer";
import { useLazyQuery, useQuery } from "@apollo/client";
import { isLoginCheckQuery } from "../query/user.query";
import { setNotification } from "../../middleware/redux/reducers/notification.reducer";
import { resetAuthUserDetail, setAuthUserDetail } from "../../middleware/redux/reducers/userAuth.reducer";
import { resetAllReducerState } from "../../middleware/redux/resetAll";

export const PrivateRoutes = ({children})=>{
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('authToken');
    const [getUser, {data, error}] = useLazyQuery(isLoginCheckQuery,{
        variables:{
            deviceId: localStorage.getItem('deviceId'),
        },
        fetchPolicy: 'network-only',
    });


    useEffect(()=>{
        if(error?.message?.length>0){
            localStorage.clear();
            dispatch(setNotification(
                {
                    error: false,
                    notificationState:true, 
                    message:"Logout gracefully!",

                }
            ));
            
            const token = localStorage.getItem('authToken');
            if(!token){
                resetAllReducerState();
                localStorage.clear();
                dispatch(resetAll());
                localStorage.clear();
                sessionStorage.clear();
                window.location="/";
            }
            localStorage.clear();

        }
    }, [error]);

    const dispatch = useDispatch();
    const {pathname} = useLocation();
    console.log(pathname, "pathhh")
    useEffect(()=>{
        setInterval(()=>{
            if(localStorage.getItem('authToken')){
                getUser();
            }else{
                if(pathname!=="/"){
                    window.location="/";
                }
            }
        }, 2000)
        setLoading(false);

    },[]);

    return(
        loading || !token? 
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height:'100vh'}}>
            <Spinner color={'#ff7a53'} fontSize={80}/>
        </div>
        :
        children
    );
}