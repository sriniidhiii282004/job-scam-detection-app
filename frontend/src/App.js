import { createBrowserRouter, RouterProvider } from "react-router";
import EditJobPage from "./pages/EditJobPage";
import JobDetailPage, { deleteEventAction, jobDetailLoader } from "./pages/JobDetailPage";
import JobsPage, { jobsLoader } from "./pages/JobsPage";
import HomePage from "./pages/HomePage";
import NewJobPage, { newEventAction } from "./pages/NewJobPage";
import RootLayout from "./RootLayout";
import JobsLayout from "./JobsLayout";
import ErrorPage from "./pages/ErrorPage";
import { changeEventAction } from "./components/JobForm";
import NewsletterPage, { newsletterAction } from './pages/NewsletterPage';
import AuthenticationPage, { authAction } from "./pages/AuthenticationPage";
import { checkAuthLoader, logoutAction, tokenLoader } from "./pages/Logout";
import VisualDashboardPage, { visualsLoader } from "./pages/VisualDashboardPage";


const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout/>,
    errorElement: <ErrorPage/>,
    id: 'root',
    loader: tokenLoader,
    children: [
      {
          index: true,
          element: <HomePage/>
      },
      {
        path: 'jobs',
        element: <JobsLayout/>,
        children:[
          {
            index: true,
            element: <JobsPage/>,
            loader: jobsLoader,
          },
          {
            path: ':id',
            id:'event-detail',
            loader: jobDetailLoader,
            children: [
              {
                index: true,
                element: <JobDetailPage/>,
                action: deleteEventAction
              },
              {
                path: 'edit', // if '/' in the path, it will be absolute path. This is relative path.
                element: <EditJobPage/>,
                action: changeEventAction,
                loader: checkAuthLoader
              },
            ]
          },
          {
            path: 'new',
            element: <NewJobPage/>,
            action: changeEventAction,
            loader: checkAuthLoader
          },

        ]
      },
      {
        path: 'newsletter',
        element: <NewsletterPage />,
        action: newsletterAction,
      },
       {
        path: 'visuals',
        element: <VisualDashboardPage />,
        loader: visualsLoader,
      },
      {
        path: 'auth',
        element: <AuthenticationPage/>,
        action: authAction
      },
      {
        path: 'logout',
        action: logoutAction
      }

    ]
  },
]);

function App() {
  return <RouterProvider router={router}/>
}

export default App;

