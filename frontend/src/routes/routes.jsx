import { createBrowserRouter } from "react-router-dom";

import App from "../App";

import HomePage from "../pages/home/HomePage";
import LoginPage from "../pages/auth/login/LoginPage";
import SignUpPage from "../pages/auth/signup/SignUpPage";
import NotificationPage from "../pages/notification/NotificationPage";
import ProfilePage from "../pages/profile/ProfilePage";



export const router = createBrowserRouter(
    [
        {
            path:"/",
            element:<App/>,
            children:[
                {index:true, element:<HomePage />},
                {path:"login", element:<LoginPage />},
                {path:"signup", element:<SignUpPage />},
                {path:"notifications", element:<NotificationPage />},
                {path:"profile/:username",element:<ProfilePage/>}
            ]
        }
    ]
)