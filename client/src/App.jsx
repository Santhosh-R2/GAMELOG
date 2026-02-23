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
      {/* <NavigationHandler /> */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0a0a0c',
            color: '#00f3ff',
            border: '1px solid #00f3ff',
            borderRadius: '4px',
            fontFamily: "'Orbitron', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '0.85rem',
            padding: '12px 20px',
            boxShadow: '0 0 20px rgba(0, 243, 255, 0.15)'
          },
          success: {
            iconTheme: {
              primary: '#00f3ff',
              secondary: '#0a0a0c',
            },
          },
          error: {
            iconTheme: {
              primary: '#ff003c',
              secondary: '#0a0a0c',
            },
            style: {
              border: '1px solid #ff003c',
              color: '#ff003c',
              boxShadow: '0 0 20px rgba(255, 0, 60, 0.15)'
            }
          }
        }}
      />
      <Routes>
        <Route path="/" element={[<CyberNavbar />, <LandingPage />]} />
        <Route path="/about" element={[<CyberNavbar />, <About />]} />
        <Route path="/archive" element={[<CyberNavbar />, <Archive />]} />
        <Route path="/login" element={[<CyberNavbar />, <Login />]} />
        <Route path="/register" element={[<CyberNavbar />, <Register />]} />
        <Route path="/forgot-password" element={[<CyberNavbar />, <ForgotPassword />]} />
        <Route path="/dashboard" element={[<UserLayout><UserDashBoard /></UserLayout>]} />
        <Route path="/profile" element={<UserLayout><Profile /></UserLayout>} />
        <Route path="/add-blog" element={<UserLayout><AddBlog /></UserLayout>} />
        <Route path="/view-blogs" element={<UserLayout><ViewBlogs /></UserLayout>} />
        <Route path="/blog/:id" element={<UserLayout><BlogDetails /></UserLayout>} />
      </Routes>
    </Router>
  )
}

export default App