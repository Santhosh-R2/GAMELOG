import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import CyberNavbar from './components/common/CyberNavbar'
import LandingPage from './components/common/LandingPage'
import About from './components/common/About'
import Archive from './components/common/Archive'
import Login from './components/Pages/Login'
import Register from './components/Pages/Register'
import ForgotPassword from './components/Pages/ForgotPassword'
import UserLayout from './UserLayout'
import UserDashBoard from './components/Pages/UserDashBoard'
import Profile from './components/Pages/Profile'
import AddBlog from './components/Pages/AddBlog'
import ViewBlogs from './components/Pages/ViewBlogs'
import MyBlogs from './components/Pages/MyBlogs'
import BlogDetails from './components/Pages/BlogDetails'
import EditBlog from './components/Pages/EditBlog'
import NavigationHandler from './NavigationHandler'

function App() {
  return (
    <Router>
      <NavigationHandler/>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#0a0a0c',
            color: '#00f3ff',
            border: '1px solid rgba(0, 243, 255, 0.2)',
            borderRadius: '0',
            fontFamily: "'Rajdhani', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '0.9rem',
            padding: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          },
          success: {
            iconTheme: {
              primary: '#00f3ff',
              secondary: '#111',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff003c',
              secondary: '#111',
            },
            style: {
              border: '1px solid rgba(255, 0, 60, 0.2)',
              color: '#ff003c'
            }
          }
        }}
      />
      <Routes>
        <Route path="/" element={[<CyberNavbar/>,<LandingPage />]} />
        <Route path="/about" element={[<CyberNavbar/>,<About />]}/>
        <Route path="/archive" element={[<CyberNavbar/>,<Archive />]}/>
        <Route path="/login" element={[<CyberNavbar/>,<Login />]}/>
        <Route path="/register" element={[<CyberNavbar/>,<Register />]}/>
        <Route path="/forgot-password" element={[<CyberNavbar/>,<ForgotPassword />]}/>
        <Route path="/dashboard" element={[<UserLayout><UserDashBoard /></UserLayout>]} />
        <Route path="/profile" element={<UserLayout><Profile /></UserLayout>} />
        <Route path="/add-blog" element={<UserLayout><AddBlog /></UserLayout>} />
        <Route path="/view-blogs" element={<UserLayout><ViewBlogs /></UserLayout>} />
        <Route path="/my-blogs" element={<UserLayout><MyBlogs /></UserLayout>} />
        <Route path="/blog/:id" element={<UserLayout><BlogDetails /></UserLayout>} />
        <Route path="/edit-blog/:id" element={<UserLayout><EditBlog /></UserLayout>} />
      </Routes>
    </Router>
  )
}

export default App