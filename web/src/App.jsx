import { Navigate, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import ChatPage from "./pages/ChatPage"
import { useAuth } from "@clerk/clerk-react"
import PageRouter from "./components/PageRouter"
import useUserSync from "./hooks/useUserSync"

export default function App() {
  const { isLoaded, isSignedIn } = useAuth()
  useUserSync()
  if (!isLoaded) return <PageRouter />
  
  return (
    <Routes>
      <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to="/chat" />} />
      <Route path="/chat" element={isSignedIn ? <ChatPage /> : <Navigate to="/" />} />
    </Routes>
  )
}