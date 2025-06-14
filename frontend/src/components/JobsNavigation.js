import { NavLink, useRouteLoaderData } from 'react-router';
import classes from './JobsNavigation.module.css';

function JobsNavigation() {
  const token = useRouteLoaderData('root');
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink to="/jobs" className={({ isActive }) => (isActive ? classes.active : undefined)} end>All Jobs</NavLink>
          </li>
          {token && (
          <li>
            <NavLink to="/jobs/new" className={({isActive}) => (isActive ? classes.active : undefined)}>New Job</NavLink>
          </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default JobsNavigation;
