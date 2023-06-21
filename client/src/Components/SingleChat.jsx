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

// eslint-disable-next-line react/prop-types
const ENDPOINT = "http://localhost:4000/"
let socket,selectedChatCompare ;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false)
  const toast = useToast();

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
        console.log("🚀 ~ file: SingleChat.jsx:30 ~ fetchMessages ~ data:", data)
        setLoading(false)
      } catch (error) {
        console.log("Error: " + error);
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
        console.log("🚀 ~ file: SingleChat.jsx:35 ~ sendMessage ~ data:", data)
        setMessages([...messages,data])
      } catch (error) {
        console.log("Error: " + error);
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
  }

  useEffect(() => {fetchMessages()},[selectedChat])
  useEffect(() =>{
    socket = io(ENDPOINT)
    socket.emit("setup",user)
    socket.on("connection",() => setSocketConnected(true))
  },[])
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
