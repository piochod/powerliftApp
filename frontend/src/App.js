import './App.css';
import Cookies from 'js-cookie';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  redirect
} from "react-router-dom";
import LoggedPage from './pages/LoggedPage';
import WorkoutPage from './pages/WorkoutPage';
import StatsPage from './pages/StatsPage';
import WorkoutViewPage from './pages/WorkoutViewPage';
import ExercisesPage from './pages/ExercisesPage';

function App() {

  function checkAuth() {
    const token = Cookies.get('accessToken');
    if (!token) {
      throw redirect('http://localhost:3001/login');
    }
    return null;
  }

  function checkNotAuth() {
    const token = Cookies.get('accessToken');
    if (token) {
      throw redirect('http://localhost:3001/home')
    }
    return null;
    
  }


  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route>
        <Route 
          index 
          loader={() => {
            const token = Cookies.get('accessToken');
            return token ? redirect('/home') : redirect('/login');
          }} 
        />
        <Route path='/home' element={<LoggedPage />} loader={checkAuth}/>
        <Route path='/login' element={<LoginPage />} loader={checkNotAuth} />
        <Route path='/register' element={<RegisterPage />} loader={checkNotAuth} />
        <Route path='/workout' element={<WorkoutPage />} loader={checkAuth} />
        <Route path='/stats' element={<StatsPage />} loader={checkAuth} />
        <Route path='/workout/:id' element={<WorkoutViewPage />} loader={checkAuth} />
        <Route path='/exercises' element={<ExercisesPage />} loader={checkAuth} />
      </Route>
    )
  )


  return (
    <div className="App">
      <RouterProvider router={router} />

    </div>
  );
}

export default App;
