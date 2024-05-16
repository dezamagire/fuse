import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserPage from './pages/user/UserPage';
import Saved from './pages/Saved';
import Search from './pages/Search';
import PostPage from './pages/post/PostPage';
import Filler from './pages/Filler';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} index/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user/:username" element={<UserPage username={''} />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/search" element={<Search />} />
        <Route path="/post/:postId" element={<PostPage postId={''} />} />
        <Route path="/filler" element={<Filler />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
