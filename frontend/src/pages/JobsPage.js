import JobsList from '../components/JobsList';
import { useLoaderData } from 'react-router';

function JobsPage() {
  const jobs = useLoaderData();
  return (
    <>
      {<JobsList jobs={jobs} />}
    </>
  );
}

export default JobsPage;

export async function eventsLoader() {
  const response = await fetch('http://localhost:8080/jobs/');
  console.log('response', response);
  
  if (!response.ok) {
    throw new Response(JSON.stringify({ message: 'Could not fetch jobs.' }), {status: 500});
  } else {
    const resData = await response.json();
    return resData.jobs;
  }
}