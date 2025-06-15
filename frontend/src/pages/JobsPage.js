// import { useReducer } from 'react';
// import { useLoaderData } from 'react-router-dom';
// import JobsList from '../components/JobsList';
// import classes from './../components/JobsList.module.css';

// const jobsReducer = (state, action) => {
//   switch (action.type) {
//     case 'LOAD_START':
//       return { ...state, loading: true };
//     case 'LOAD_SUCCESS':
//       return { jobs: action.payload, loading: false };
//     case 'LOAD_ERROR':
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };

// function JobsPage() {
//   const initialJobs = useLoaderData();
//   const [state, dispatch] = useReducer(jobsReducer, {
//     jobs: initialJobs,
//     loading: false,
//     error: null
//   });

//   // Single dispatch - one state update for everything
//   const loadData = async () => {
//     dispatch({ type: 'LOAD_START' });
//     try {
//       const response = await fetch('http://localhost:8080/jobs/');
      
//       if (!response.ok) {
//         throw new Error('Could not fetch more jobs.');
//       }
      
//       const resData = await response.json();
//       dispatch({ type: 'LOAD_SUCCESS', payload: resData.jobs });
      
//     } catch (error) {
//       console.error('Error loading jobs:', error);
//       dispatch({ type: 'LOAD_ERROR', payload: error.message });
//     }
//   };

//   return (
//     <>
//       <div id="dataContainer">
//         <JobsList jobs={state.jobs} />
//       </div>
//       <button
//         id="loadMore"
//         onClick={loadData}
//         className={classes.load_more_btn}
//         disabled={state.loading}
//       >
//         {state.loading ? 'Loading...' : 'Load More'}
//       </button>
//     </>
//   );
// }

// export default JobsPage;

// // Fixed the loader function name to match the component
// export async function eventsLoader() {
//   const response = await fetch('http://localhost:8080/jobs/');
//   console.log('response', response);
  
//   if (!response.ok) {
//     throw new Response(JSON.stringify({ message: 'Could not fetch jobs.' }), {
//       status: 500
//     });
//   }
  
//   const resData = await response.json();
//   return resData.jobs;
// }

// import { useReducer } from 'react';
// import { useLoaderData } from 'react-router-dom';
// import JobsList from '../components/JobsList';
// import classes from './../components/JobsList.module.css';

// const jobsReducer = (state, action) => {
//   switch (action.type) {
//     case 'LOAD_START':
//       return { ...state, loading: true };
//     case 'LOAD_SUCCESS':
//       return { 
//         jobs: [...state.jobs, ...action.payload.jobs], // Append new jobs
//         loading: false, 
//         hasMore: action.payload.hasMore, // Track if more data available
//         currentPage: state.currentPage + 1
//       };
//     case 'LOAD_ERROR':
//       return { ...state, loading: false, error: action.payload };
//     case 'RESET':
//       return { 
//         jobs: action.payload, 
//         loading: false, 
//         hasMore: true, 
//         currentPage: 1,
//         error: null 
//       };
//     default:
//       return state;
//   }
// };

// function JobsPage() {
//   const initialJobs = useLoaderData();
//   const [state, dispatch] = useReducer(jobsReducer, {
//     jobs: initialJobs,
//     loading: false,
//     hasMore: true, // Assume there's more data initially
//     currentPage: 1,
//     error: null
//   });

//   const loadData = async () => {
//     // Don't load if already loading or no more data
//     if (state.loading || !state.hasMore) return;
    
//     dispatch({ type: 'LOAD_START' });
    
//     try {
//       // Pass page parameter for pagination
//       const response = await fetch(`http://localhost:8080/jobs/?page=${state.currentPage + 1}&limit=10`);
      
//       if (!response.ok) {
//         throw new Error('Could not fetch more jobs.');
//       }
      
//       const resData = await response.json();
      
//       // Check if there's more data available
//       const hasMore = resData.jobs && resData.jobs.length > 0 && 
//                      (resData.hasMore !== undefined ? resData.hasMore : resData.jobs.length === 10);
      
//       dispatch({ 
//         type: 'LOAD_SUCCESS', 
//         payload: { 
//           jobs: resData.jobs || [], 
//           hasMore: hasMore 
//         }
//       });
      
//     } catch (error) {
//       console.error('Error loading jobs:', error);
//       dispatch({ type: 'LOAD_ERROR', payload: error.message });
//     }
//   };

//   const renderButton = () => {
//     if (state.loading) {
//       return (
//         <button
//           id="loadMore"
//           style={{
//             padding: '10px 20px',
//             backgroundColor: '#ccc',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'not-allowed',
//             opacity: 0.6
//           }}
//           disabled={true}
//         >
//           Loading...
//         </button>
//       );
//     }
    
//     if (!state.hasMore) {
//       return (
//         <button
//           id="loadMore"
//           style={{
//             padding: '10px 20px',
//             backgroundColor: '#999',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'not-allowed',
//             opacity: 0.5
//           }}
//           disabled={true}
//         >
//           No More Jobs Available
//         </button>
//       );
//     }
    
//     return (
//       <button
//         id="loadMore"
//         onClick={loadData}
//         style={{
//           padding: '10px 20px',
//           backgroundColor: '#007bff',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: 'pointer'
//         }}
//       >
//         Load More
//       </button>
//     );
//   };

//   return (
//     <>
//       <div id="dataContainer">
//         <JobsList jobs={state.jobs} />
//       </div>
      
//       {/* Show error message if any */}
//       {state.error && (
//         <div style={{ color: 'red', margin: '10px 0' }}>
//           Error: {state.error}
//         </div>
//       )}
      
//       {/* Render appropriate button state */}
//       {renderButton()}
      
//       {/* Optional: Show jobs count */}
//       <div style={{ marginTop: '10px', color: '#666' }}>
//         Showing {state.jobs.length} jobs
//       </div>
//     </>
//   );
// }

// export default JobsPage;

// // Updated loader to support initial pagination
// export async function eventsLoader() {
//   const response = await fetch('http://localhost:8080/jobs/?page=1&limit=10');
//   console.log('response', response);
  
//   if (!response.ok) {
//     throw new Response(JSON.stringify({ message: 'Could not fetch jobs.' }), {
//       status: 500
//     });
//   }
  
//   const resData = await response.json();
//   return resData.jobs || [];
// }

import { useState, useEffect } from 'react';
import { useLoaderData } from 'react-router-dom';
import JobsList from '../components/JobsList';
import classes from './../components/JobsList.module.css';

// Number of items to show per "Load More" click
const ITEMS_PER_PAGE = 10;

function JobsPage() {
  // Load all data at once (from your CSV)
  const allJobs = useLoaderData();
  
  // State to track visible items
  const [visibleJobs, setVisibleJobs] = useState([]);
  const [itemsToShow, setItemsToShow] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(false);

  // Initialize with first chunk of data
  useEffect(() => {
    setVisibleJobs(allJobs.slice(0, itemsToShow));
  }, [allJobs, itemsToShow]);

  const loadMore = () => {
    setLoading(true);
    
    // Simulate network delay (remove in production)
    setTimeout(() => {
      setItemsToShow(prev => prev + ITEMS_PER_PAGE);
      setLoading(false);
    }, 300);
  };

  const hasMore = itemsToShow < allJobs.length;

  return (
    <>
      <div id="dataContainer">
        <JobsList jobs={visibleJobs} />
      </div>
      
      {hasMore && (
        <div style={{
          flex: 1,
          width: '100%',
          justifyContent: 'center',
          alignItems:'center',
          alignContent: 'center',
           display: 'flex',       
          }}>

        <button
          id="loadMore"
          onClick={loadMore}
          disabled={loading}
          style={{
            // padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            width: '20%',
            height: 45,
            fontSize: '18px',
           fontWeight: 'bold'

          }}
        >
          {loading ? 'Loading...' : 'Load More'}
        </button>
        </div>
      )}
      
      {!hasMore && allJobs.length > ITEMS_PER_PAGE && (
        <p style={{ color: '#666', marginTop: '20px' }}>
          All jobs loaded ({allJobs.length} total)
        </p>
      )}
      
      <div style={{ marginTop: '10px', 
        color: '#666' , width: '100%', textAlign: 'center'}}>
        Showing {visibleJobs.length} of {allJobs.length} jobs
      </div>
    </>
  );
}

// Loader function - loads ALL data from CSV
export async function jobsLoader() {
  // Replace this with your actual CSV loading logic
  const response = await fetch('http://localhost:8080/jobs');
  
  if (!response.ok) {
    throw new Response(JSON.stringify({ message: 'Could not fetch jobs.' }), {
      status: 500
    });
  }
  
  const resData = await response.json();
  return resData.jobs || [];
}

export default JobsPage;