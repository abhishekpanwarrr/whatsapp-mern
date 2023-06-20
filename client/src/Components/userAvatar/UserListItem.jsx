import { Avatar, Box,Text } from "@chakra-ui/react";

// eslint-disable-next-line react/prop-types
const UserListItem = ({user,handleFunction}) => {
  return (
    <Box
    onClick={handleFunction}
    cursor="pointer"
    bg="#E8E8E8"
    _hover={{
      background: "#38B2AC",
      color: "white",
    }}
    w="100%"
    d="flex"
    alignItems="center"
    color="black"
    px={3}
    py={2}
    mb={2}
    borderRadius="lg"
  >
    <Avatar
      mr={2}
      size="sm"
      cursor="pointer"
      // eslint-disable-next-line react/prop-types
      name={user.name}
      // eslint-disable-next-line react/prop-types
      src={user.picture}
      />
    <Box>
      {/* eslint-disable-next-line react/prop-types */}
      <Text>{user.name}</Text>
      <Text fontSize="xs">
        <b>Email : </b>
      {/* eslint-disable-next-line react/prop-types */}
        {user.email}
      </Text>
    </Box>
  </Box>
  )
}

export default UserListItem