import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router'
import Layout from './routes/Layout'
import ProtectedRoute from './routes/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
//Main Pages
import Main from './pages/main'
import UploadPage from './pages/upload'
import ExplorePage from './pages/explore'
import GameJamsPage from './pages/gameJams'
import GameJamDetailsPage from './pages/gameJamDetails'
import CreateGameJamPage from './pages/createGameJam'
import GamePlayer from './pages/gamePlayer'
import ProfilePage from './pages/profile'
//Auth Pages
import LoginPage from './pages/login'
import RegisterPage from './pages/register'
import ForgotPasswordPage from './pages/forgotPassword'
import ResetPasswordPage from './pages/resetPassword'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Main /> },
      { path: 'explore', element: <ExplorePage /> },
      { path: 'jams', element: <GameJamsPage /> },
      { path: 'jams/new', element: <ProtectedRoute><CreateGameJamPage /></ProtectedRoute> },
      { path: 'jams/:id', element: <GameJamDetailsPage /> },
      { path: 'upload', element: <ProtectedRoute><UploadPage /></ProtectedRoute> },
      { path: 'profile', element: <ProtectedRoute><ProfilePage /></ProtectedRoute> },
      { path: 'game/:id', element: <GamePlayer /> }
    ]
  },
  {
    path: '/auth',
    element: <Layout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> }
    ]
  },
  {
    path: '*',
    element: <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-slate-700">404 - Página Não Encontrada</div> 
  }
])

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)
