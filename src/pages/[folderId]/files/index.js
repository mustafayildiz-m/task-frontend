import React, { useState } from 'react';

import {
  Box,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';

import PageContainer from '@/components/PageContainer';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import axios from 'axios';
require('dotenv').config()

import File from '@/components/File';

const Files = () => {
  const [fileListData, setFileListData] = useState(null);
  const router = useRouter();
  const { folderId } = router.query;

  const { data, error, isLoading } = useQuery('fileList', async () => {
    try {
      const { data } = await axios.post(`${process.env.API_REQUEST_URL}/dev/files`,{ folderId: folderId },{
        headers: {
          'auth-token': process.env.API_KEY
        }
      });
      setFileListData(data);
    } catch (err) {
      console.error('an error occurred during the request:', err.message);
      throw err;
    }
  });

  const handleFileDeleted = (fileId) => {
    // updated list
   // console.log(fileId)
    const updatedData = fileListData.filter((file) => file.fileId !== fileId);
    setFileListData(updatedData);
  };


  return (
    <>
      <PageContainer title="Files">
        <Flex>
          <Box
            maxW={'330px'}
            minW="300px"
            w={'full'}
            mr="5"
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={'2xl'}
            rounded={'md'}
            overflow={'hidden'}
          >
            <Box
              bg={useColorModeValue('gray.50', 'gray.900')}
              minH="250px"
              px={6}
              py={10}
            >
              {fileListData && Array.isArray(fileListData) && fileListData.map((file, index) => (
                  <File
                      key={index}
                      file={file}
                      onFileDeleted={handleFileDeleted}
                  />


            ))}

            </Box>
          </Box>
        </Flex>
      </PageContainer>
    </>
  );
};

export default Files;
