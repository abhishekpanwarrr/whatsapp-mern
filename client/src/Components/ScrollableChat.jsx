import ScrollableFeed from "react-scrollable-feed"
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogic"
import { ChatState } from "../context/ChatContext"
import { Avatar, Tooltip } from "@chakra-ui/react"

// eslint-disable-next-line react/prop-types
const ScrollableChat = ({messages}) => {
    const {user} = ChatState()
  return (
    <ScrollableFeed>
         {/* eslint-disable-next-line react/prop-types */}
        {messages && messages.length > 0 && messages.map((m,i) =>{
            
            return (
                <div style={{display:"flex"}} key={m._id}>
                    {(isSameSender(messages,m,i,user._id)
                     || isLastMessage(messages,i,user._id)) && <Tooltip
                     label={m.sender.name}
                     placement="bottom-start"
                     hasArrow
                     >
                        <Avatar mt={7} mr={1} size={"sm"} cursor={"pointer"} name={m.sender.name} src={m.sender.pic} />
                     </Tooltip>
                    }
                    <span style={{
                        backgroundColor:`${m.sender._id === user._id ? "#bee3f8" :"#b9f5d0"}`,
                        borderRadius:"20px",
                        padding:"5px 15px",
                        maxWidth:"75%",
                        marginLeft:isSameSenderMargin(messages,m,i,user._id),
                        marginTop:isSameUser(messages,m,i,user._id) ? 3 :10
                    }}>
                        {m.content}
                    </span>
                </div>
            )
        })}
    </ScrollableFeed>
  )
}

export default ScrollableChat