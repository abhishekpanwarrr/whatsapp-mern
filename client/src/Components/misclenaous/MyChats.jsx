import { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatContext";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { AddIcon } from "@chakra-ui/icons";
import GroupChatModal from "./GroupChatModal";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/ChatLogic";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();
  const navigate = useNavigate()

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    const fetchChats = async () => {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      };

      try {
        const {data}  = await axios.get(
          "http://localhost:4000/api/chat",
          config
        );
        
        setChats(data);
      } catch (error) {
        if(error.response.status === 401){
          localStorage.clear();
          navigate("/")
          return toast({
            title: "You are unauthorized",
            description: "Failed to Load the chats",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      }
    };
    (async () => await fetchChats())();

    // eslint-disable-next-line
  }, [fetchAgain]);
  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            Create Group
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
