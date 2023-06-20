import {
  Box,
  Button,
  Tooltip,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  MenuDivider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChevronDownIcon, BellIcon, SearchIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatContext";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import ChatLoading from "./ChatLoading";
import UserListItem from "../userAvatar/UserListItem";


const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user ,setSelectedChat,chats,setChats } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async() =>{
    if(!search){
       return toast({
            title:"Enter something",
            status:"warning",
            duration:4000,
            isClosable:true,
            position:"top-left"
        })
    }

    try {
        setLoading(true); 
        const config ={
            headers:{
                Authorization: `Bearer ${user?.token}`
            }
        }
        const {data} = await axios.get(`http://localhost:4000/api/user?search=${search}`,config)
        console.log("🚀 ~ file: SideDrawer.jsx:63 ~ handleSearch ~ data:", data)
        setLoading(false)
        setSearchResult(data)
        setSearch("")
    } catch (error) {
        return toast({
            title:error.message,
            status:"error",
            duration:4000,
            isClosable:true,
            position:"top-left"
        })
    }
  }

  const accessChat = async(userId) =>{
    try {
        setLoadingChat(true);
        const config ={
            headers:{
                "Content-Type": "application/json",
                Authorization: `Bearer ${user?.token}`
            }
        }
        const {data} = await axios.post("http://localhost:4000/api/chat",{userId},config)
        if(chats.find(c => c._id === data._id)) return setChats([data,...chats])
        setSelectedChat(data)
        setLoadingChat(false)
        onClose()
    } catch (error) {
        setLoadingChat(false);
        return toast({
            title:error.message,
            status:"error",
            duration:4000,
            isClosable:true,
            position:"top-left"
        })
    }
  }
  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search user to chat" hasArrow placement="bottom">
          <Button variant="ghost"  onClick={onOpen}>
            <SearchIcon />
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search user
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl">Whatsapp</Text>
        <div>
          <Menu>
            <MenuButton p={1} mr={2}>
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList>
              <MenuItem>Download</MenuItem>
              <MenuItem>Create a Copy</MenuItem>
              <MenuItem>Mark as Draft</MenuItem>
              <MenuItem>Delete</MenuItem>
              <MenuItem>Attend a Workshop</MenuItem>
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      {/* Drawer */}
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
          <DrawerBody>
           <Box display="flex" pb={2}>
                <Input 
                placeholder="Search by username" 
                mr={2}
                value={search}
                onChange={e => setSearch(e.target.value)}
                />
                <Button onClick={handleSearch}>Go</Button>
           </Box>
           {loading ? (<ChatLoading />) : <>
            {searchResult?.map(user => (
                <UserListItem  key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
            ))}
           </>
           }
          </DrawerBody>
          {loadingChat && <Spinner ml="auto" display="flex" />}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
