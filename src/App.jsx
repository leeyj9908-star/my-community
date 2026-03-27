import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home-page';
import PostDetailPage from './pages/post-detail-page';
import PostCreatePage from './pages/post-create-page';
import LoginPage from './pages/login-page';
import SignupPage from './pages/signup-page';

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/posts/create' element={<PostCreatePage />} />
      <Route path='/posts/:id' element={<PostDetailPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />
    </Routes>
  );
}

export default App;
