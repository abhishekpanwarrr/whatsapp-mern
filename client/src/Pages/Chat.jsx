import {ChatState} from "../context/ChatContext"
import {Box} from "@chakra-ui/react"
import SideDrawer from "../Components/misclenaous/SideDrawer"

const Chat = () => {
  const {user} = ChatState()
  return (
    <div style={{width:"100%"}}>
      {user && <SideDrawer />}
      <Box>

      </Box>
    </div>
  )
}

export default Chat