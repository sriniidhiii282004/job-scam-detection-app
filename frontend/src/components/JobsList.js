import { Link } from 'react-router';
import classes from './JobsList.module.css';

function JobsList({ jobs }) {
  

  const truncateWords = (text, wordLimit = 20) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };


  return (
    <div className={classes.events}>
      <h1>All Jobs</h1>
      <ul className={classes.list}>
        {jobs && jobs.map((job) => (
            
            // <li key={job.id} className={classes.item}>
            //   <Link to={job.id} className={classes.link}>
            //     <img src={job.image} alt={job.title} />
            //     <div className={classes.content}>
            //       <h2>{job.title}</h2>
            //       <time>{job.date}</time>
            //     </div>
            //     <div className={classes.btn_container}>
            //       <button className={classes.custom_btn} onClick={() => alert('this Job is a fraud')}>Apply</button>
            //     </div>
            //   </Link>
            // </li>
            <li key={job.id} className={classes.item}>
  <div className={classes.jobRow}>
    <div className={classes.imageContainer}>
      <img src={job.image} alt={job.title} />
    </div>

    <div className={classes.details}>
      <Link to={job.id} className={classes.link}>
        <h2>{job.title}</h2>
        <time>{job.date}</time>
      </Link>
      <p>{truncateWords(job.description)}</p>
      <div className={classes.btn_container}>
        <button
          className={classes.custom_btn}
          onClick={() => alert('this Job is a fraud')}
        >
          Apply
        </button>
      </div>
    </div>
  </div>
</li>


        ))}
      </ul>
    </div>
  );
}

export default JobsList;
