// import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import DashboardLayout from "./components/DashboardLayout";
import { Home, Dashboard, Bucket, Upload, User } from "./pages";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout><Dashboard /></DashboardLayout>,
  },
  {
    path: '/bucket',
    element: <DashboardLayout><Bucket /></DashboardLayout>,
  },
  {
    path: '/upload',
    element: <DashboardLayout><Upload /></DashboardLayout>,
  },
  {
    path: '/:user',
    element: <DashboardLayout><User /></DashboardLayout>,
  },
]);
function App() {
  // const [count, setCount] = useState(0)

  return <RouterProvider router={router} />;
}

export default App
