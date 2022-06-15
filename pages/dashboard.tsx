import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Flex,
  Text,
  Heading,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import axios from "axios";
import useSWR from "swr";

interface Image {
  url: string;
  timestamp: string;
  image_type: string;
}

interface HeaderBarProps {
  setAlbum: (album: string) => void;
}

function HeaderBar(props: HeaderBarProps) {
  const { setAlbum } = props;
  return (
    <Flex
      display={"fixed"}
      h="64px"
      top={0}
      width={"100vw"}
      flexDirection="row"
      justifyContent="center"
      alignItems={"center"}
      bg={"green.200"}
      boxShadow="xl"
    >
      <Flex w="50%" justifyContent={"start"}>
        <Link href={"/"}>
          <IconButton
            aria-label="Back to home"
            icon={<ChevronLeftIcon boxSize={"2rem"} />}
            variant={"ghost"}
            size="lg"
          />
        </Link>
        <Heading size="xl" fontFamily={"Roboto Mono"} px={4}>
          Dashboard
        </Heading>
      </Flex>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          Albums
        </MenuButton>
        <MenuList>
          <MenuItem
            onClick={() => {
              setAlbum("all");
            }}
          >
            All
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAlbum("alert");
            }}
          >
            Alert
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAlbum("snapshot");
            }}
          >
            Snapshot
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}

function ImageCard(props: { image: Image }) {
  const { image } = props;
  const date = new Date(image.timestamp);
  const captured_at = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(
    date.getHours()
  ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(
    date.getSeconds()
  ).padStart(2, "0")}`;

  return (
    <Flex
      width={"45%"}
      my={3}
      mx={1}
      boxShadow="2xl"
      borderRadius={"2xl"}
      align="center"
      flexDirection={"column"}
      overflow="hidden"
    >
      <Flex justify={"center"} pb={2} w="100%">
        <Image
          src={`${image.url}`}
          alt={`${image.url}`}
          fallbackSrc="https://media.giphy.com/media/EeIX8IZvvGZ2CRCWSO/giphy.gif"
        />
      </Flex>
      <Flex
        w="80%"
        justifyContent={"space-between"}
        py={2}
        flexDirection="row"
        flexWrap={"wrap"}
      >
        <Text fontSize={"sm"} fontFamily={"Roboto Mono"} color="gray.500">
          Captured at:{" "}
        </Text>
        <Text fontSize={"sm"} fontFamily={"Roboto Mono"}>
          {captured_at}{" "}
        </Text>
      </Flex>
    </Flex>
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

interface DashboardProps {
  api_url: string;
}

function DashboardPage(props: DashboardProps) {
  const router = useRouter();
  const { api_url } = props;
  const { user, error } = useUser();
  const userDataFetcher = async (api_url: string) => {
    return await axios.post(api_url, {
      user: user?.sub,
    });
  };
  const { data, error: SWRError } = useSWR(
    api_url + "/api/user",
    userDataFetcher
  );
  const [album, setAlbum] = useState("all");
  const images: Image[] = useMemo(() => {
    if (data) {
      if (album === "alert") {
        return data.data.user.images.filter(
          (image: Image) => image.image_type === "alert"
        );
      }
      if (album === "snapshot") {
        return data.data.user.images.filter(
          (image: Image) => image.image_type === "snapshot"
        );
      }
      return data.data.user.images;
    }
    return [];
  }, [data, album]);

  return (
    <Flex minH="100vh" flexDirection={"column"}>
      <HeaderBar setAlbum={setAlbum} />
      {!user ? (
        <Flex
          minH="90vh"
          justifyContent={"center"}
          alignItems="center"
          flexDirection={"column"}
        >
          <Text>{`Navigate back to home page to login first!`}</Text>
        </Flex>
      ) : SWRError || error ? (
        <Flex
          minH="90vh"
          justifyContent={"center"}
          alignItems="center"
          flexDirection={"column"}
        >
          <Text>{`There are some error occur when fetching your data :(`}</Text>
          <Text>Try again later.</Text>
        </Flex>
      ) : (
        <Flex
          minH="90vh"
          justifyContent={"start"}
          alignItems="center"
          flexDirection={"column"}
          pt={6}
        >
          {images.length === 0 ? (
            <Flex
              minH="90vh"
              justifyContent={"center"}
              alignItems="center"
              flexDirection={"column"}
            >
              <Heading
                as="h3"
                size="md"
                fontFamily={"Roboto Mono"}
                py={2}
              >{`No images in database 👀`}</Heading>
            </Flex>
          ) : (
            <Flex w="50%" flexWrap={"wrap"} justify="space-between">
              <Flex w="100%" justify={"center"} mb={2}>
                <Flex w="40%" justifyContent={"space-between"}>
                  <Text color="gray.500" fontFamily={"Roboto Mono"}>
                    Current album:{" "}
                  </Text>
                  <Text color="green.500" fontFamily={"Roboto Mono"}>
                    {album}
                  </Text>
                </Flex>
              </Flex>
              {images.map((image, index) => (
                <ImageCard key={index} image={image} />
              ))}
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );
}

export default DashboardPage;
