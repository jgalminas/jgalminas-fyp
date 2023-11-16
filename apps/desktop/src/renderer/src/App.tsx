import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AuthProvider from './auth/AuthContext';
import SecureRoute from './auth/SecureRoute';
import Main from './layouts/Main';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UnauthedOnlyRoute from './auth/UnauthedOnlyRoute';
import Matches from './pages/matches/Matches';
import Highlights from './pages/Highlights';
import Recordings from './pages/recordings/Recordings';
import Settings from './pages/Settings';

const App = () => {

  return (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path='login' element={<UnauthedOnlyRoute element={<Login/>}/>}/>
        <Route path='signup' element={<UnauthedOnlyRoute element={<SignUp/>}/>}/>

        <Route path='/' element={<SecureRoute element={<Main/>}/>}>
          <Route index element={<SecureRoute element={<Home/>}/>}/>
          <Route path='matches' element={<SecureRoute element={<Matches/>}/>}/>
          <Route path='highlights' element={<SecureRoute element={<Highlights/>}/>}/>
          <Route path='recordings' element={<SecureRoute element={<Recordings/>}/>}/>
          <Route path='settings' element={<SecureRoute element={<Settings/>}/>}/>
        </Route>
        
      </Routes>
    </AuthProvider>
  </BrowserRouter>
  )
}

export default App
