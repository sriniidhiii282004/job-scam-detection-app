import React from 'react';
import { redirect, useLoaderData, useParams, useRouteLoaderData } from 'react-router';
import JobItem from '../components/JobItem';
import { getAuthToken } from '../util/auth';

export default function JobDetailPage(props) {
  // const { job } = props;
  const { id } = useParams();
  const data = useRouteLoaderData('event-detail');
  console.log('job=====', data);
  
  return (
    <JobItem job={data} id={id} />
    // <div>JobDetailPage - {id}</div>
  )
}

export async function eventDetailLoader({ request, params }) {
  console.log('request====', request);
  
  const id = params.id;
  const response = await fetch('http://localhost:8080/jobs/' + id);
  console.log('response====', response);
  
  if (!response.ok) {
    throw new Response(JSON.stringify({ message: 'Could not fetch job details' }), {status: 500});
  } else {
    const resData = await response.json();
    console.log('response====33333', resData);
    return resData.event;
  }
}

export async function deleteEventAction({ params }) {
  const id = params.id;
  const token = getAuthToken();
  
  const response = await fetch('http://localhost:8080/jobs/' + id, {
    method: 'delete',
    headers: {
      'Authorization': 'Bearer ' + token,
    }
  });
  console.log('response====4444=====', response);
  if (!response.ok) {
    throw new Response(JSON.stringify({ message: 'Could not delete job' }), {status: 500});
  } else {
    
    return redirect('/jobs');
  }
}
