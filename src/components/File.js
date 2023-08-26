import React, { useState } from 'react';
import {
  Button,
  ButtonGroup,
  Input,
  Stack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  InputRightElement,
  PopoverArrow,
  PopoverHeader,
  PopoverBody,
  Spacer,
  Icon,
  PopoverCloseButton,
  IconButton,
  Box,
  Text,
  HStack,
  useColorModeValue, InputGroup,
} from '@chakra-ui/react';
import {
  MdDriveFileMoveOutline,
  MdInsertDriveFile,
  MdDelete,
} from 'react-icons/md';
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
require('dotenv').config()


const File = ({ file = {},onFileDeleted }) => {
  const [destinationFolder, setDestinationFolder] = useState(''); //state storing the target file name
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMv, setIsOpenMv] = useState(false);
  const queryClient = useQueryClient();

  const onClose = () => setIsOpen(false);
  const onCloseMv = () => setIsOpenMv(false);


  const handleDelete = async (fileId) => {
    try {
      // console.log(fileId)
       //delete request
      await axios.delete(`${process.env.API_REQUEST_URL}/dev/delete`, {
        data: { fileId: fileId },
        headers: {
          'auth-token': process.env.API_KEY
        }//send the ID of the file to delete
      });

     // deletion successful, update cache
     await queryClient.invalidateQueries('fileList');

      //notify the parent component to remove it from the list
      onFileDeleted(fileId);

      //close comfirm screen
      onClose();


    } catch (error) {
      console.error('an error occurred during the deletion process:', error);
    }
  };
  const handleMove = async () => {
    try {
      const destination = destinationFolder;
      if (!destination) {
        alert('The destination file name cannot be empty.');
        return;
      }
      const response = await axios.post(`${process.env.API_REQUEST_URL}/dev/move`, {
        destination: destination,
        source: {
          fileId: file.fileId,
          name: file.name,
          folderId: file.folderId,
        },
      },{
        headers: {
          'auth-token': process.env.API_KEY
        }
      });

      await queryClient.invalidateQueries('fileList');
      onCloseMv();

      // Move sonucunu konsola yazdır
      console.log('Move işlemi sonucu:', response.data);
    } catch (error) {
      console.error('Move işlemi sırasında hata oluştu:', error);
    }
  };
  
  return (
    <HStack mb={4} spacing={5}>
      <Icon as={MdInsertDriveFile} color="green.400" />
      <Text>{file.name}</Text>

      <Popover isOpenMv={isOpenMv} onClose={() => setIsOpenMv(false)}>
        <PopoverTrigger>
          <IconButton
            ml="100px"
            colorScheme="blue"
            size="sm"
            icon={<MdDriveFileMoveOutline w="40px" h="40px" />}
            onClick={() => setIsOpenMv(true)}

          />
        </PopoverTrigger>
        <PopoverContent p={5}>
          <PopoverArrow />
          <PopoverCloseButton />
          <Stack spacing={4}>
            <InputGroup>
              <Input
                  type="text"
                  placeholder="Enter destination folder"
                  value={destinationFolder}
                  onChange={(e) => setDestinationFolder(e.target.value)}
              />
              <InputRightElement>
                <Button size="sm" colorScheme="blue" onClick={()=>{
                  handleMove();
                  onCloseMv()
                }}>
                  Move
                </Button>
              </InputRightElement>
            </InputGroup>
          </Stack>
        </PopoverContent>
      </Popover>
      <Popover isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PopoverTrigger>
          <IconButton
            ml="100px"
            colorScheme="red"
            size="sm"
            icon={<MdDelete w="40px" h="40px" />}
            onClick={() => setIsOpen(true)}
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>Confirmation!</PopoverHeader>
          <PopoverBody d="flex">
            <Box>Are you sure you want to delete this message?</Box>
            <Spacer />
            <Box d="flex" alignItems="center" justifyItems="center">
              <Button size="sm"
                      colorScheme="red"
                      onClick={() =>{
                        onClose()
                        handleDelete(file.fileId)
                      }}

              >
                Yes
              </Button>
            </Box>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </HStack>
  );
};

export default File;
