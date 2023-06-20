import { Box, IconButton, Text } from "@chakra-ui/react"
import { ChatState } from "../context/ChatContext"
import {ArrowBackIcon} from "@chakra-ui/icons"
import { getSender, getSenderFull } from "../config/ChatLogic"
import ProfileModal from "./misclenaous/ProfileModal"

// eslint-disable-next-line react/prop-types
const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const {user,selectedChat,setSelectedChat} = ChatState()
  return (
    <>
        {selectedChat ? (
          <>
          <Text
            fontSize={{base:"28px",md:"30px"}}
            pb={3}
            px={2}
            w="100%"
            display={"flex"}
            justifyContent={{base:"space-between"}}
            alignItems={"center"}
          >
            <IconButton
              display={{base:"flex",md:"none"}}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
             />
             {!selectedChat.isGroupChat ? <>
              {getSender(user,selectedChat.users)}
              <ProfileModal user={getSenderFull(user,selectedChat.users)} />
             </>: (
              <>
                {selectedChat?.chatName?.toUpperCase()}
              </>
             )}
          </Text>
          <Box 
            display={"flex"}
            justifyContent={"flex-end"}
            flexDir={"column"}
            p={3}
            bg="#e8e8e8"
            w="100%"
            h="100%"
            overflowY="hidden"
          >

          </Box>
              </>
        ) : (
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <Text fontSize="3xl" pb={3}>Click on a chat to start chatting</Text>
            </Box>  
        )}
    </>
  )
}

export default SingleChat