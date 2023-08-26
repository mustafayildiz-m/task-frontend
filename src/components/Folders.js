import React from 'react';
import {
  Box,
  Text,
  HStack,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import { MdArrowForwardIos } from 'react-icons/md';
import { useQuery } from 'react-query';
import axios from 'axios';
require('dotenv').config()
import Link from "next/link";


const Folders = () => {

  const { isLoading, isError, data } = useQuery('folderList', async () => {

    try {
      const { data } = await axios.get(`${process.env.API_REQUEST_URL}/dev/folders`,{
        headers: {
          'auth-token': process.env.API_KEY
        }
      })
      return data;
    } catch (err) {
      console.error('error occurred during request:', err);
      throw err;
    }

  });

  return (
    <>

      <Flex>
        {isLoading ? (
            <Text>Loading...</Text>
        ) : data ? data.map((folder, index) => {
          return (
              <Link
                  href={{
                    pathname: "/[folderId]/files",
                    query: { folderId: folder.folderId },
                  }}
                  key={index}
              >
                <Box
                    maxW={'330px'}
                    minW="300px"
                    w={'full'}
                    mr="5"
                    bg={useColorModeValue('white', 'gray.800')}
                    boxShadow={'2xl'}
                    rounded={'md'}
                    overflow={'hidden'}
                    cursor={"pointer"}
                >
                  <HStack
                      textAlign={'center'}
                      p={6}
                      color={useColorModeValue('gray.800', 'white')}
                      align={'center'}
                  >
                    <Text
                        fontSize={'sm'}
                        fontWeight={500}
                        bg={useColorModeValue('green.50', 'green.900')}
                        p={2}
                        px={3}
                        mr="10px"
                        color={'green.500'}
                        rounded={'full'}
                    >
                      Name: {folder.name} Id: {folder.folderId}
                    </Text>
                    <Box ml="10px"><MdArrowForwardIos/></Box>
                  </HStack>
                </Box>
              </Link>
          );
        }) : isError ? (
            <Text>Something went wrong!</Text>
        ):""}
      </Flex>

    </>
  );
};

export default Folders;
