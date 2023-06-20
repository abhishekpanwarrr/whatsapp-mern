import { ViewIcon } from '@chakra-ui/icons'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    IconButton,
    Image,
    Text,
  } from '@chakra-ui/react'

// eslint-disable-next-line react/prop-types
const ProfileModal = ({user,children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
    {children ? (<span onClick={onOpen}>{children}</span>) :(
        <IconButton
        display="flex"
        icon={<ViewIcon />}
        onClick={onOpen}
        />
    ) }
  
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
           {/* eslint-disable-next-line react/prop-types */}
          <ModalHeader display="flex" justifyContent={"center"}>{user?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" justifyContent="center" flexDirection="column" alignItems="center" gap="1rem">
            <Image
                borderRadius="full"
                boxSize="150px"
                //  eslint-disable-next-line react/prop-types
                src={user?.pic}
                //  eslint-disable-next-line react/prop-types
                alt={user?.name}
                />
                {/* eslint-disable-next-line react/prop-types */}
            <Text fontSize="2xl">Email:- {user?.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>
  )
}

export default ProfileModal