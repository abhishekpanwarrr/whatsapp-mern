import { Routes,Route } from "react-router-dom"
import Home from "./Pages/Home"
import Chat from "./Pages/Chat"
const App = () => {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chat />} />
    </Routes>
  )
}

export default App