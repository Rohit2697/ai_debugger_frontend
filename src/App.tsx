
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {SignInPage,SignUpPage} from './pages/AuthPages';

import DashBoardPage from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<SignInPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/' element={
          <ProtectedRoute>
            <DashBoardPage />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
