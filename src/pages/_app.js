import Router from 'next/router';
import NProgress from 'nprogress';

import { Box, ChakraProvider } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';

import theme from '@/styles/theme';
import GlobalStyle from '@/styles/styles';
import '@/styles/css/nprogress.css';

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const MotionBox = motion(Box);
const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps, router }) => (
  <ChakraProvider resetCSS theme={theme}>
    <GlobalStyle>
      <AnimatePresence exitBeforeEnter>
        <MotionBox
          key={router.route}
          animate="enter"
          as="main"
          exit="exit"
          flexGrow={1}
          initial="initial"
          variants={{
            initial: { opacity: 0, y: -10 },
            enter: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 10 },
          }}
        >
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </MotionBox>
      </AnimatePresence>
    </GlobalStyle>
  </ChakraProvider>
);

export default MyApp;
