import {ChatState} from "../context/ChatContext"
import {Box} from "@chakra-ui/react"
import SideDrawer from "../Components/misclenaous/SideDrawer"
import MyChats from "../Components/misclenaous/MyChats"
import ChatBox from "../Components/misclenaous/ChatBox"
import { useState } from "react"

const Chat = () => {
  const {user} = ChatState()
  const [fetchAgain,setFetchAgain] = useState(false )
  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="91.5vh"
        p="10px"
      >
        <MyChats fetchAgain={fetchAgain} />
        <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </div>
  )
}

export default Chat