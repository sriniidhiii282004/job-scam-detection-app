import React from 'react'
import JobForm from '../components/JobForm'
import { redirect } from 'react-router';
import { getAuthToken } from '../util/auth';

export default function NewEventPage() {
  return (
    <JobForm method={'POST'} />
  )
}

export async function newEventAction({ request, params }) {
  const data = await request.formData();
  const event = {
    title: data.get('title'),
    image: data.get('image'),
    date: data.get('date'),
    description: data.get('description'),
  };
  console.log(event);
  const token = getAuthToken();

  const response = await fetch('http://localhost:8080/jobs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Response({ message: 'Could not create event.' }, { status: 500 });
  }

  else {
    return redirect('/jobs');
  }
    
}
