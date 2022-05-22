import { Flex, Divider, Text, Heading, Button } from "@chakra-ui/react";
import { MdCall } from "react-icons/md";
import { FaGithub, FaBook } from "react-icons/fa";
import { ChevronRightIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";

// Landing page of the application
function Home(): JSX.Element {
  const { user, error, isLoading } = useUser();

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return <h1>Error: {error.message}</h1>;
  }

  return (
    <Flex minH="100vh" justifyContent={"center"} alignItems="center">
      <Flex
        w={{ base: "100%", md: "52%" }}
        h={{ base: "100%", md: "500px" }}
        borderRadius="lg"
        bg="green.200"
        flexDirection={"row"}
        p={4}
      >
        <Flex
          w="70%"
          justifyContent={"space-between"}
          p={2}
          flexDirection="column"
        >
          <Heading as="h1" size="2xl" fontFamily={"Roboto Mono"} mb={2}>
            NMLAB SecurityCam
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
            <>
              <Text
                fontSize={"2xl"}
                fontWeight={800}
                fontFamily={"Roboto Mono"}
              >
                Welcome back!
              </Text>
              <Text fontSize={"xl"} fontWeight={800} fontFamily={"Roboto Mono"}>
                {user.name}
              </Text>
              <Link href="/">
                <Button
                  mt={6}
                  colorScheme="whatsapp"
                  rightIcon={<ChevronRightIcon />}
                >
                  {`Dashboard`}
                </Button>
              </Link>
              <Link href="/api/auth/logout">
                <Button mt={6} bg="pink.100" rightIcon={<ChevronRightIcon />}>
                  {`Log out`}
                </Button>
              </Link>
            </>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}

export default Home;
