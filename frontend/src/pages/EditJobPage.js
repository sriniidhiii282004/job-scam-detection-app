import React from 'react'
import { useParams, useRouteLoaderData } from 'react-router';
import JobForm from '../components/JobForm';

export default function EditJobPage() {
  const { id } = useParams();
  const data = useRouteLoaderData('event-detail');
  console.log('EditJobPage=====', data);
  
  return (
    <JobForm job={data} method={'PATCH'}/>
  )
}
