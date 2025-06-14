import React from 'react'
import PageContent from '../components/PageContent'
import { useRouteError } from 'react-router'

export default function ErrorPage() {
  console.log('ErrorPage===');
  const routeError = useRouteError();
  let status = routeError.status;

  let title = 'An error occurred!';
  let msg = routeError.data;

  console.log('msg===', routeError);
  
  if (status === 404) {
    title = 'Not found!!!'
    msg = 'Could not find page.'
  } else {
    title = 'An error occurred!'
    msg = JSON.parse(msg).message;
  }
  return (
    <PageContent title={title}>{msg}</PageContent>
  )
}
