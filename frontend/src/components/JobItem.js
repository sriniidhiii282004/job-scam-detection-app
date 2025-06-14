import { Link, useRouteLoaderData, useSubmit } from 'react-router';
import classes from './JobItem.module.css';

function JobItem({ job }) {  
  const submit = useSubmit();
  const token = useRouteLoaderData('root');

  function startDeleteHandler() {
    const proceed = window.confirm('Are you sure?');
    
    if (proceed) {
      submit(null, {method: 'delete'});
    }
  }

  return (
    <article className={classes.event}>
      <img src={job.image} alt={job.title} />
      <h1>{job.title}</h1>
      <time>{job.date}</time>
      <p>{job.description}</p>
      {token && (
        <menu className={classes.actions}>
          <Link to={'edit'}>Edit</Link>
          <button onClick={startDeleteHandler}>Delete</button>
        </menu>
      )}
    </article>
  );
}

export default JobItem;
