import {
    Button,
    FormControl,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
    useToast
  } from "@chakra-ui/react";
  import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie"
const Login = () => {
  const toast = useToast()
  const navigate = useNavigate()
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)
    const handleSubmit = async() =>{
      if(!email || !password ){
        return toast({
          title:"Fill all the required fields",
          status:"error",
          duration:3000,
          isClosable:true,
          position:"top-right"
        })
      }
      try {
        const config = {
          headers:{
            "Content-Type": "application/json"
          }
        }
        const {data} = await axios.post("http://localhost:4000/api/user/login",{email,password},config)
        localStorage.setItem("userInfo",JSON.stringify(data))
        Cookies.set('token', data.token, { path: '/' })
        toast({
          title:"Logged in successfully",
          status:"success",
          duration:3000,
          isClosable:true,
          position:"top-right"
        })
        setLoading(false)
        navigate("/chats")
      } catch (error) {
        return toast({
          title:error.message,
          status:"error",
          duration:3000,
          isClosable:true,
          position:"top-right"
        })
      }
    }
  return (
    <VStack spacing="5px">
    <FormControl isRequired>
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
    </FormControl>
    <FormControl isRequired>
      <InputGroup>
        <Input
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
            {show ? "Hide" : "Show"}
          </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>

    <Button isLoading={loading} colorScheme="whatsapp" width="100%" style={{marginTop:15}} onClick={handleSubmit}>
          Login 
    </Button>
    <Button colorScheme="orange" width="100%" style={{marginTop:15}} onClick={() =>{
        setEmail("guest@example.com")
        setPassword("123456")
    }}>
          Get guest user credentials 
    </Button>
  </VStack>
  )
}

export default Login