import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"

const Signup = () => {
  const toast = useToast()
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const [pic,setPic] =useState("");
  console.log("🚀 ~ file: Signup.jsx:24 ~ Signup ~ pic:", pic)
  const navigate = useNavigate()
  const postDetails = async(images) =>{
    setLoading(true);
    if(images === undefined){
      toast({
        title:"Select an image...",
        status:"error",
        duration:3000,
        isClosable:true,
        position:"top-right"
      })
      return 
    }
    if(images.type === "image/jpeg" || images.type === "image/png"){
      const data = new FormData()
      data.append("file",images)
      data.append("upload_preset","whatsapp")
      try {
        const res = await fetch("https://api.cloudinary.com/v1_1/dl1a6idba/image/upload",{
          method:"POST",
          body:data
        })
        const {url} = await res.json()
       setPic(url)
       setLoading(false)
      } catch (error) {
        console.log("🚀 ~ file: Register.jsx:53 ~ upload ~ error:", error)
        setLoading(false)
      }
    }else{
      toast({
        title:"Select an image...",
        status:"warning",
        duration:3000,
        isClosable:true,
        position:"top-right"
      })
      return
    }
  }
  const handleSubmit = async() =>{
    setLoading(true)
    if(!email || !name || !password || !confirmPassword){
      return toast({
        title:"Fill all the required fields",
        status:"error",
        duration:3000,
        isClosable:true,
        position:"top-right"
      })
    }
    if(password !== confirmPassword){
      return toast({
        title:"Password doesn't match.",
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
      const {data} = await axios.post("http://localhost:4000/api/user",{name,email,password,pic},config)
      localStorage.setItem("userInfo",JSON.stringify(data))
      toast({
        title:"User created successfully",
        status:"success",
        duration:3000,
        isClosable:true,
        position:"top-right"
      })
      setLoading(false)
      navigate("/")
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
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </FormControl>
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
      <FormControl isRequired>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Upload photo</FormLabel>
        <Input type="file" p={1.5}  accept="image/**" onChange={e => postDetails(e.target.files[0])} />
      </FormControl>
      <Button isLoading={loading} colorScheme="whatsapp" width="100%" style={{marginTop:15}} onClick={handleSubmit}>
            {loading ? "Profile uploadinf..." : "Signup"}
      </Button>
    </VStack>
  );
};

export default Signup;
