import { Badge } from "@chakra-ui/react"
import { CloseIcon } from "@chakra-ui/icons";
// eslint-disable-next-line react/prop-types
const UserBadgeItem = ({user,handleFunction,admin}) => {
  return (
    <Badge
    px={2}
    py={1}
    borderRadius="lg"
    m={1}
    mb={2}
    variant="solid"
    fontSize={12}
    colorScheme="purple"
    cursor="pointer"
    onClick={handleFunction}
  >
    {/* eslint-disable-next-line react/prop-types */}
    {user.name}
    {/* eslint-disable-next-line react/prop-types */}
    {admin === user._id && <span> (Admin)</span>}
    <CloseIcon pl={1} />
  </Badge>
  )
}

export default UserBadgeItem