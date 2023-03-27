import { Navigate, Outlet } from "react-router-dom";

import { Page } from "./config";


export const ProtectedRoute = ({ redirectPath = Page.HOME, isLoggedIn }: any) => {  
    // const dispatch = useDispatch();
    // useEffect(() => {
    //     checkLoginSession();
    // }, []);
  
  // function checkLoginSession(){
  //   const interval = setInterval(() => {
  //     if(accessToken !== undefined && accessToken !== null && accessToken !== ""){
  //     let decoded:any = jwt_decode(accessToken);
  //     let expireTimestamp = decoded?.exp;
  //     let currentTimestamp = new Date().getTime()/1000;
  //       let isExpired = expireTimestamp > currentTimestamp ? false : true;
  //       if(isExpired) {
  //         dispatch(logOut());
  //       }
  //     }
  //   }, 10000);

  //   return () => clearInterval(interval);
  // }
  
  if (!isLoggedIn) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
}
  
