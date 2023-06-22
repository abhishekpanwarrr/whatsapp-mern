import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import { ChatState } from "../context/ChatContext";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModal from "./misclenaous/ProfileModal";
import UpdateGroupChat from "./misclenaous/UpdateGroupChat";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import './style.css'
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client"
import Lottie from "react-lottie"
import animationData from "../animation/typing.json"

// eslint-disable-next-line react/prop-types
const ENDPOINT = "http://localhost:4000/"
let socket,selectedChatCompare ;
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
}
// eslint-disable-next-line react/prop-types
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat,notifications, setNotifications  } = ChatState();
  console.log("🚀 ~ file: SingleChat.jsx:30 ~ SingleChat ~ notifications:", notifications)
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing,setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const toast = useToast();

  useEffect(() =>{
    socket = io(ENDPOINT)
    socket.emit("setup",user)
    socket.on("connection",() => setSocketConnected(true))
    socket.on("typing",() =>setIsTyping(true))
    socket.on("stop typing",() =>setIsTyping(false))
  },[])

  const fetchMessages = async() =>{
    if(!selectedChat) return
      try {
        const config={
          headers:{
            Authorization: `Bearer ${Cookies.get("token")}`,
          }
        }
        setLoading(true)
        const {data} = await axios.get(`http://localhost:4000/api/message/${selectedChat._id}`,config)
        setMessages(data)
        setLoading(false)
        socket.emit( "join chat",selectedChat._id )
      } catch (error) {
        return toast({
          title: error.message,
          description: "Failed to Load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
  }
  const sendMessage = async(event) => {
    if(event.key === "Enter" && newMessage){
      try {
          socket.emit("stop typing",selectedChat._id)
        const config={
          headers:{
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
          }
        }
        setNewMessage("")
        const {data} = await axios.post("http://localhost:4000/api/message",{
          content:newMessage,
          chatId:selectedChat._id
        },config)
        socket.emit("new message",data)
        setMessages([...messages,data])
      } catch (error) {
        return toast({
          title: error.message,
          description: "Failed to Load the chats",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  }
  const typingHandler = async(e) => {
    setNewMessage(e.target.value)
    // Socket conneced or not 
    if(!socketConnected) return

    if(!typing){
      setTyping(true)
      socket.emit("typing",selectedChat._id )
    }
    let lastTime = new Date().getTime();
    let timer = 3000;

    setTimeout(() =>{
      let timeNow = new Date().getTime();
      let timeDifference = timeNow - lastTime
      if(timeDifference >= timer && typing){
        socket.emit("stop typing",selectedChat._id)
        setTyping(false)
      }
    },timer)

  }

  useEffect(() => {
    fetchMessages()
    selectedChatCompare = selectedChat
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selectedChat])

  useEffect(() =>{
    socket.on("message received",(newMessageRecieved) =>{
      console.log("newMessageRecieved",newMessageRecieved);
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){
        // Give notification
        if(!notifications.includes(newMessageRecieved)){
          console.log("inside");
          setNotifications([newMessageRecieved, ...notifications ]);
          setFetchAgain(!fetchAgain)
        }
      }else{
        console.log("else part");
        setMessages([...messages,newMessageRecieved])
      }
    })
  })
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat?.chatName?.toUpperCase()}
                {
                  <UpdateGroupChat
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                }
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
            {loading ? <Spinner size={"xl"} w={20} h={20} alignSelf="center" margin="auto" /> :(
              <div className="messages">
                  <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} mt={3} isRequired>
            {isTyping ? (<div><Lottie
            options={defaultOptions}  
            width={50} 
            style={{marginBottom:15,marginLeft:0}} 
            /> </div>): ""}
              <Input 
                placeholder="Enter message"
                onChange={(e) => typingHandler(e)}
                bg="#eoeoeo"
                variant="filled"
                value={newMessage}
              />
          </FormControl>
          </Box>
          
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3}>
            Click on a chat to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
