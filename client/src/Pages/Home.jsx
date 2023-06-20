import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import Login from "../Components/Authentication/Login";
import Signup from "../Components/Authentication/Signup";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate()
  useEffect(() =>{
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if(user){
      navigate("/chats")
    }else{
      navigate("/")
    }
  },[navigate])
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="2xl" color="black">
          Whats App
        </Text>
      </Box>

      <Box bg="white" p={4} borderRadius="lg" borderWidth="1px" w="100%">
        <Tabs>
          <TabList mb="1rem">
            <Tab width="50%">Login </Tab>
            <Tab width="50%">Sign up</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
