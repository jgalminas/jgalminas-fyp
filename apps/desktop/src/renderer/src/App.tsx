import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AuthProvider from './auth/AuthContext';
import SecureRoute from './auth/SecureRoute';
import Main from './layouts/Main';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import UnauthedOnlyRoute from './auth/UnauthedOnlyRoute';

const App = () => {

  return (
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path='login' element={<UnauthedOnlyRoute element={<Login/>}/>}/>
        <Route path='signup' element={<UnauthedOnlyRoute element={<SignUp/>}/>}/>

        <Route path='/' element={<SecureRoute element={<Main/>}/>}>
          <Route index element={<SecureRoute element={<Home/>}/>}/>
        </Route>
        
      </Routes>
    </AuthProvider>
  </BrowserRouter>
  )
}

export default App
