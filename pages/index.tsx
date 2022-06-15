import {
  Flex,
  Divider,
  Text,
  Heading,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Input,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { MdCall } from "react-icons/md";
import { FaGithub, FaBook } from "react-icons/fa";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import useSWR from "swr";
import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, auth0Id: string) => Promise<AxiosResponse>;
  auth0Id: string | null | undefined;
}

function FirstTimeModal(props: ModalProps) {
  const toast = useToast();
  const { isOpen, onClose, onSubmit, auth0Id } = props;
  const [lineID, setLineID] = useState("");
  // useEffect(() => {
  //   console.log(lineID);
  // }, [lineID]);
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Hi there!</ModalHeader>
        <ModalBody>
          <Flex py={2} flexDirection="column" mb={2}>
            <Text>Welcome to join us!</Text>
            <Text>To enable our service, please input your LineID below.</Text>
          </Flex>
          <Input
            placeholder="Insert your LineID here!"
            onChange={(e) => {
              setLineID(e.target.value);
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Flex>
            <Button
              disabled={lineID.length === 0}
              onClick={async () => {
                if (auth0Id) {
                  const data = await onSubmit(lineID, auth0Id);
                  if (data.status === 200) {
                    onClose();
                  } else {
                    toast({
                      title: "Error",
                      description:
                        "Something went wrong, try again or check use connection.",
                      status: "error",
                      duration: 3000,
                      isClosable: true,
                    });
                  }
                } else {
                  toast({
                    title: "Error",
                    description:
                      "Something went wrong, try again later or check use connection.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                }
              }}
            >
              Submit
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export async function getStaticProps() {
  const url = process.env.API_ENDPOINT;

  return {
    props: {
      api_url: url,
    },
  };
}

export interface HomePageProps {
  api_url: string;
}

// Landing page of the application
function Home(props: HomePageProps): JSX.Element {
  const router = useRouter();
  const { api_url } = props;
  const { isOpen, onClose } = useDisclosure();
  const { user, error, isLoading } = useUser();
  const userFetcher = async (api_url: string) => {
    return await axios.post(api_url, {
      user: user?.sub,
    });
  };
  const { data, error: SWRError } = useSWR(
    user ? api_url + "/api/user" : null,
    userFetcher
  );
  const onSubmit = async (id: string, auth0Id: string) => {
    return await axios.post(api_url + "/api/create_user", {
      id: id,
      auth0Id: auth0Id,
    });
  };
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log("data: ", data?.data.user);
    if (data && data.data.user === null) {
      setShowModal(true);
    }
  }, [data]);

  if (isLoading) {
    return <></>;
  }

  if (error || SWRError) {
    return (
      <>
        <h1>Error: {error?.message}</h1>
      </>
    );
  }

  return (
    <Flex minH="100vh" justifyContent={"center"} alignItems="center">
      <FirstTimeModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        onSubmit={onSubmit}
        auth0Id={user?.sub}
      />
      <Flex
        w={{ base: "100%", md: "60%" }}
        h={{ base: "100%", md: "500px" }}
        borderRadius="lg"
        bg="green.200"
        flexDirection={"row"}
        p={4}
      >
        <Flex
          w="75%"
          justifyContent={"space-between"}
          p={2}
          flexDirection="column"
        >
          <Heading as="h1" size="2xl" fontFamily={"Roboto Mono"}>
            NMLAB
          </Heading>
          <Heading as="h1" size="2xl" fontFamily={"Roboto Mono"} mb={2}>
            SecurityCam
          </Heading>
          <Flex flexDirection={"column"}>
            <Flex w="100%">
              <Heading
                as="h3"
                size="md"
                fontFamily={"Roboto Mono"}
                pr={4}
                py={2}
              >
                ❇️{" "}
              </Heading>
              <Heading as="h3" size="md" fontFamily={"Roboto Mono"} py={2}>
                See everything that happens in your territory 👀
              </Heading>
            </Flex>
            <Flex w="100%">
              <Heading
                as="h3"
                size="md"
                fontFamily={"Roboto Mono"}
                pr={4}
                py={2}
              >
                ❇️{" "}
              </Heading>
              <Heading as="h3" size="md" fontFamily={"Roboto Mono"} py={2}>
                Provide real-time security alerts 🔥
              </Heading>
            </Flex>
            <Flex w="100%">
              <Heading
                as="h3"
                size="md"
                fontFamily={"Roboto Mono"}
                pr={4}
                py={2}
              >
                ❇️{" "}
              </Heading>
              <Heading as="h3" size="md" fontFamily={"Roboto Mono"} py={2}>
                Highly configurable and customizable
              </Heading>
            </Flex>
          </Flex>
          <Flex w="100%" justifyContent={"center"} mb={10}>
            <Link href="https://swh00tw.me">
              <Button mx={1} colorScheme="green" leftIcon={<FaBook />}>
                Setup Tutorial
              </Button>
            </Link>
            <Link href="https://github.com/NMLAB-SecurityCam">
              <Button mx={1} colorScheme="whatsapp" leftIcon={<FaGithub />}>
                Github
              </Button>
            </Link>
            <Link href="/api/auth/logout">
              <Button
                mx={1}
                rightIcon={<MdCall />}
                colorScheme="whatsapp"
                variant={"outline"}
              >
                Contact us
              </Button>
            </Link>
          </Flex>
        </Flex>
        <Divider orientation="vertical" color={"red"} />
        <Flex
          w="30%"
          justifyContent={"center"}
          alignItems="center"
          flexDirection={"column"}
        >
          {!user ? (
            <>
              <Text fontSize={"xl"} fontFamily={"Roboto Mono"}>
                Get started
              </Text>
              <Text
                fontSize={"2xl"}
                fontWeight={800}
                fontFamily={"Roboto Mono"}
              >
                FOR FREE
              </Text>
              <Text fontSize={"xl"} fontFamily={"Roboto Mono"}>
                NOW 🚀
              </Text>
              <Link href="/api/auth/login">
                <Button mt={6} bg="pink.100" rightIcon={<ChevronRightIcon />}>
                  {`Login / Sign up`}
                </Button>
              </Link>
            </>
          ) : (
            <Flex flexDirection={"column"} justifyContent="center" ml={4}>
              <Text
                fontSize={"2xl"}
                fontWeight={800}
                fontFamily={"Roboto Mono"}
                align="center"
              >
                Welcome back!
              </Text>
              <Text
                fontSize={"xl"}
                fontWeight={800}
                fontFamily={"Roboto Mono"}
                align="center"
              >
                {user.name} {data?.data.user ? "✅" : "⚠️"}
              </Text>
              <Link href={`/dashboard?id=${data?.data.user._id}`}>
                <Button
                  mt={6}
                  colorScheme="whatsapp"
                  rightIcon={<ChevronRightIcon />}
                  disabled={!data?.data.user}
                >
                  {`Dashboard`}
                </Button>
              </Link>
              <Link href="/api/auth/logout">
                <Button mt={6} bg="pink.100" rightIcon={<ChevronRightIcon />}>
                  {`Log out`}
                </Button>
              </Link>
            </Flex>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Home;
