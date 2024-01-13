import { Route, Routes, useNavigate } from "react-router-dom";
import { FormView } from "../../pages/formView/formView";
import { useEffect, useLayoutEffect, useState } from "react";
import Spinner from "../../components/spinner";
import { useDispatch } from "react-redux";
import { resetAll } from "../../middleware/redux/reducers/reset.reducer";
import { useLazyQuery, useQuery } from "@apollo/client";
import { isLoginCheckQuery } from "../query/user.query";
import { setNotification } from "../../middleware/redux/reducers/notification.reducer";

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
            dispatch(setNotification(
                {
                    error: true,
                    notificationState:true, 
                    message:"Session is expired",

                }
            ));
            localStorage.clear();
        }
    }, [error]);

    const dispatch = useDispatch();
    useEffect(()=>{
        setInterval(()=>{
            getUser();
            const token = localStorage.getItem('authToken');
            if(!token){
                dispatch(resetAll());
                window.location="/";
            }
        }, 10000)
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