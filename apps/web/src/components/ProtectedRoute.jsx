import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { isAuthed } = useAuth()
  const location = useLocation()
  if (!isAuthed) {
    // Preserve intended destination; never expose protected content pre-auth.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}
