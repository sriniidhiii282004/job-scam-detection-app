import React from 'react'
import JobsNavigation from './components/JobsNavigation'
import { Outlet } from 'react-router'

export default function EventsLayout() {
  return (
   <>
    <JobsNavigation />
    <Outlet/>
   </>
  )
}
