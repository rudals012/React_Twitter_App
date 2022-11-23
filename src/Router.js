import React from 'react';
import Navigation from 'components/Navigation';
// import React, { Profiler, useState } from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Profiles from 'routes/Profiles';
import Auth from './routes/Auth';
import Home from './routes/Home';

function AppRouter({isLoggedIn, userObj}) {

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
        {isLoggedIn && <Navigation userObj={userObj} />}   
        <Routes>
          {/* Route */}
            {isLoggedIn ? (
            <>
            <Route path='/' element={<Home userObj={userObj}/>} />
            <Route path='/profile' element={<Profiles userObj={userObj}/>} />
            </>
            ) : (
            <Route path='/' element={<Auth />} />
            )}
        </Routes>
    </BrowserRouter>
  )
}

export default AppRouter