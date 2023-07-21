import React, { useEffect, useRef } from "react";
import { Avatar, Flex, Text } from "@chakra-ui/react";

const Messages = ({ messages }) => {
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => elementRef.current.scrollIntoView());
    return <div ref={elementRef} />;
  };

  return (
    <Flex w="100%" h="90%" overflowY="scroll" flexDirection="column" p="3">
      {messages.map((item, index) => {
        if (item.from === "me") {
          return (
            <Flex key={index} w="100%" justify="flex-end">
              {
                item.url ? (
                    <figure style={{
                        marginTop:'16px'
                    }}>
                        <audio
                            controls
                            src={item.url}>
                                <a href={item.url}>
                                    Download audio
                                </a>
                        </audio>
                    </figure>
                ): (
                    <Flex
                        bg="black"
                        color="white"
                        minW="100px"
                        maxW="350px"
                        my="1"
                        p="3"
                        marginBottom={5}
                        marginTop={5}
                    >
                        <Text>{item.text}</Text>
                    </Flex>
                )
              }
            </Flex>
          );
        } else {
          return (
            <Flex key={index} w="100%">
              <Avatar
                name="Computer"
                src="https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light"
                bg="blue.300"
              ></Avatar>
              {
                item.url ? (
                    <figure style={{
                        marginTop:'16px'
                    }}>
                        <audio
                            controls
                            src={item.url}>
                                <a href={item.url}>
                                    Download audio
                                </a>
                        </audio>
                    </figure>
                ): (
                    <Flex
                        bg="gray.100"
                        color="black"
                        minW="100px"
                        maxW="350px"
                        my="1"
                        p="3"
                    >
                        <Text>{item.text}</Text>
                    </Flex>
                )
              }
            </Flex>
          );
        }
      })}
      <AlwaysScrollToBottom />
    </Flex>
  );
};

export default Messages;
