import React, { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { fetchUserProfile, reSetStatus } from "./store/authSlice";
import ProtectedRoute from "./ProtectedRoute";
import { SocketProvider } from "./Socket.jsx";
import { STATUSES } from "./global/http/Type.js";

const Profile = lazy(() => import("./pages/profile/Profile.jsx"));
const Spinner = lazy(() => import("./global/components/spinner/Spinner.jsx"));
const Navbar = lazy(() => import("./global/components/navbar/Navbar.jsx"));
const Home = lazy(() => import("./pages/Home/Home.jsx"));
const Register = lazy(() => import("./pages/auth/register/Register.jsx"));
const Login = lazy(() => import("./pages/auth/login/Login.jsx"));
const ChatLayout = lazy(() => import("./global/layout/ChatLayout.jsx"));
const Chats = lazy(() => import("./global/components/chats/Chats.jsx"));

function App() {
  const dispatch = useDispatch();
  const { data: user, status, isLogin } = useSelector((store) => store.auth);

  useEffect(() => {
    dispatch(fetchUserProfile());
    if (status == STATUSES.SUCCESS) {
      dispatch(reSetStatus())
    }
  }, []);

  return (
    <div style={{ height: '100vh' }}>
      <BrowserRouter>
        <Suspense fallback={<Spinner />}>
          <Navbar user={user} login={isLogin} />
          <Routes>
            <Route element={<ProtectedRoute login={!isLogin} redirect="/chat/profile" />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route
              element={
                <SocketProvider>
                  <ProtectedRoute login={isLogin} redirect="/" />
                </SocketProvider>
              }>
              <Route path="/chat" element={<ChatLayout />}>
                <Route path="/chat/profile" element={<Profile user={user} />} />
                <Route path=":id" element={<Chats />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;
