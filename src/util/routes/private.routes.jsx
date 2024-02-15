import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { FormView } from "../../pages/formView/formView";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Spinner from "../../components/spinner";
import { useDispatch } from "react-redux";
import { resetAll } from "../../middleware/redux/reducers/reset.reducer";
import { useLazyQuery, useQuery } from "@apollo/client";
import { isLoginCheckQuery } from "../query/user.query";
import { setNotification } from "../../middleware/redux/reducers/notification.reducer";
import { resetAuthUserDetail, setAuthUserDetail } from "../../middleware/redux/reducers/userAuth.reducer";
import { resetAllReducerState } from "../../middleware/redux/resetAll";
import { useSelector } from "react-redux";
import { themeQuery } from "../query/theme.query";
import { socket } from "../../config/socket";


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
            
            
            const token = localStorage.getItem('authToken');
            if(!token){
                dispatch(setNotification(
                    {
                        error: false,
                        notificationState:true, 
                        message:"Logout gracefully!",
    
                    }
                ));
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

    // themeData={themeData} themeLoading={themeLoading} refetchTheme={refetchTheme}
    const {authenticatedUserDetail} = useSelector(state=>state.userAuthReducer);
    
    const {data:themeData, loading:themeLoading, refetch: refetchTheme} = useQuery(themeQuery,{
        variables:{
            userId: authenticatedUserDetail?._id
        },
        skip: !authenticatedUserDetail?._id
    });

    const renderChildrenWithProps = () => {
        return React.Children.map(children, (child) => {
          // Check if child is a valid React element
          if (React.isValidElement(child)) {
            // Pass props to children based on conditions
            return React.cloneElement(child, {
              themeData,
              themeLoading,
              refetchTheme
            });
          }
          return child;
        });
    };

    useEffect(()=>{
        // client-side
        console.log("socket connect")
        socket.on("connect", () => {
            console.log(socket.id, "socket connect"); // x8WIv7-mJelg7on_ALbx
        });
  
        socket.on("disconnect", () => {
            console.log(socket.id, "socket connect disconnect"); // undefined
        });

    },[]);

    return(
        loading || !token? 
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height:'100vh'}}>
            <Spinner color={'#ff7a53'} fontSize={80}/>
        </div>
        :
        renderChildrenWithProps()
    );
}