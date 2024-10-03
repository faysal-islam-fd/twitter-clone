import { Navigate, Route, Routes} from "react-router-dom"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPannel"
import { Toaster } from "react-hot-toast"
import {  useQuery } from "@tanstack/react-query"
import LoadingSpinner from "./components/common/LoadingSpinner"

import HomePage from './pages/home/HomePage'
import LoginPage from './pages/auth/login/LoginPage'
import SignUpPage from './pages/auth/signup/SignUpPage'
import NotificationPage from './pages/notification/NotificationPage'
import ProfilePage from './pages/profile/ProfilePage'



const App = () => {
  const { data, isError,isLoading, error } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      const res = await fetch("/api/auth/me")
      const resData = await res.json()
      if(resData.failed){
        return null;
      }
      return resData
    },
    retry:false
  })
  if(isLoading){
    <div className="h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  }
  return (
    <div className="flex max-w-6xl  mx-auto">
     { data && <Sidebar />}
        <Routes>
            <Route path="/" element={data ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/login" element ={data ? <Navigate to="/" /> : <LoginPage />} />
            <Route path="/signup" element ={data ? <Navigate to="/" /> : <SignUpPage />  } />
            <Route path="/notifications" element ={!data?<Navigate to="/login" /> : <NotificationPage />} />
            <Route path="/profile/:username" element ={!data ? <Navigate to="/login" /> : <ProfilePage />} />
        </Routes>
      {data && <RightPanel />}
        <Toaster />
    </div>  
  )
}

export default App