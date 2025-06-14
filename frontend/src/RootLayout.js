import React, { useEffect } from 'react'
import { Outlet, useSubmit } from 'react-router'
import MainNavigation from './components/MainNavigation'
import { getAuthToken, getDuration } from './util/auth'

export default function RootLayout() {

  const submit = useSubmit();
  let token = getAuthToken();
  
  useEffect(() => {
   
    if (!token) {
      return;
    }

    const duration = getDuration();

    if (duration < 0) {
      submit(null, { method: 'post', action: '/logout' });
      return;
    }
    setTimeout(() => {
      submit(null, { method: 'post', action: '/logout' });
    }, duration);

  }, [token, submit]);
  

  return (
  <>
    <MainNavigation />
    <main>
      <Outlet />
    </main>
  </>
  )
}
