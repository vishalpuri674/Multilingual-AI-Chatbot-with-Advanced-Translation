import { Flex, Button, FormControl,FormLabel} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Divider from "../components/Divider";
import Footer from "../components/Footer";
import Header from "../components/Header";
// import Header from "../components/Header";
import Messages from "../components/Messages";
import axios from "axios";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Icon, Text} from "@chakra-ui/react";
import { Switch } from '@chakra-ui/react'


const Chat = () => {

  const [messages, setMessages] = useState([{ from: "computer", text: "Hello, how can I help you" }]);
  const [inputMessage, setInputMessage] = useState("");
  const [showCloseTicket, setShowCloseTicket] = useState(false);
  const [showFallbackButton, setShowFallbackButton] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [sessionId, setSesionId] = useState(Date)
  const [thankText, setThankText] = useState("")
  const [isgoo, setIsgoo] = useState(true)
  const path = window.location.pathname;

  //   const [messages, setMessages] = useState([
  //     { from: "computer", text: "Hi, My Name is HoneyChat" },
  //     { from: "me", text: "Hey there" },
  //     { from: "me", text: "Myself Ferin Patel" },
  //     {
  //       from: "computer",
  //       text:
  //         "Nice to meet you. You can send me message and i'll reply you with same message."
  //     }
  //   ]);

  useEffect(()=>{
    console.log(path.substring(1))
    if(path!=="/"){
    axios.post("/v1/ticket",{"text": "dce"}, {
      headers: {
        "Content-Type": 'application/json',
        "ticket-id": path.substring(1)
      }
    })
      .then(function (response) {

        console.log(response)
        const lines = response.data.split('\n');
        let c =true
        let msg=[]
        let i=0
        lines.forEach(line => {
          if (i>1){
          if (c) {msg.push({"from": "me", text: line })}
          else {msg.push({"from": "computer", text: line })}
          c=!c
          } i++;
        });
        setMessages(msg);
      })
      .catch(function (error) {
        console.log(error);
      })
    console.log(path);
    }
  },[])
  
  const handleSendMessage = () => {
    if (!inputMessage.trim().length) {
      return;
    }
    const data = inputMessage;

    setMessages((old) => [...old, { from: "me", text: data }]);
    setInputMessage("");
    callChatBotAPI({
        type:"message",
        data:data
    })    
  };

  const handleAudioMessage = (formData, blobURL) => {
    setMessages((old) => [...old, { from: "me", url: blobURL }]);
    callChatBotAPI({
        type:"media",
        data:formData
    })    
  }


  const handleCloseTicket = () => {
    setThankText("I'm glad I was able to help you, Thank you for using our service!")
    setShowThankYouModal(true);
    setMessages([])
    setShowCloseTicket(false);
    setShowFallbackButton(false);
    setSesionId(Date);
  };


  const handleContactAgent = () => {
      axios.post("/v1/agent",{"text":"ewfd"}, {
        headers: {
          "session-id": sessionId
        }
      })
      .then(function (response) {
        console.log(response)
        setThankText(`We have created a tickect Our executive will reach out to you within 2 hours. Your ticket id is ${response.data} `)
        setShowThankYouModal(true);
        setShowFallbackButton(false);
        setSesionId(Date);
      })
      .catch(function (error) {
        console.log(error);
      })
  };

  const handleThankYouModalClose = () => {
    setShowThankYouModal(false);
  };

  const callChatBotAPI = async ({
    type, data
  }) =>{ 
    if(type=="media"){
        try {
          setMessages((old) => [...old, { from: "computer", text: "Typing..." }]);
          const response = await axios
            .post("/v1/query", data, {
              headers: { "Content-Type": "multipart/form-data", 'session-id': sessionId, "model": isgoo},
            })
          setMessages((old) => {let dold = old; dold.pop(); return [...dold, { from: "computer", text: response.data.message }]})
          console.log("File successfully uploaded:", response.data.message);
          setShowCloseTicket(true);
          setShowFallbackButton(response.data.category.toLowerCase() == "others")
        } catch (err) {
          console.error("Error uploading file:", err);
        }
      }
      else{
        setMessages((old) => [...old, { from: "computer", text: "Typing..." }]);
        axios.post("/v1/query", {"text": data}, {
          headers: {
            "Content-Type": 'application/json',
            "session-id": sessionId,
            "model": isgoo
          }
        })
          .then(function (response) {
            console.log(response)
            setMessages((old) => {let dold = old; dold.pop(); return [...dold, { from: "computer", text: response.data.message }]})
            setShowCloseTicket(true);
            setShowFallbackButton(response.data.category.toLowerCase() == "others")
          })
          .catch(function (error) {
            console.log(error);
          })
      }
  }

  return (
    <Flex w="100%" h="100vh" justify="center" align="center">
      <Flex w={["100%", "100%", "40%"]} h="98%" flexDir="column">
     
        <Header />
        {path=="/" ? <FormControl display='flex' alignItems='center' justifyContent='center'>
          
       <FormLabel htmlFor='email-alerts' mb='0'>
       Optimised Translation
      </FormLabel>
      <Switch isChecked={isgoo} onChange={()=>{setIsgoo(!isgoo)}} id='email-alerts' />
      </FormControl> : null}
        {/* <Divider /> */}
        <Messages messages={messages} />
        <Flex justify="center" align="center">
          {showFallbackButton && (
            <Button
              onClick={handleContactAgent}
              mr={10}
              colorScheme="red"
              variant="outline"
              width="200px"
            >
              Contact Agent
            </Button>
          )}
          {showCloseTicket && (
            <Button
              onClick={handleCloseTicket}
              ml={10}
              colorScheme="green"
              variant="outline"
              width="200px"
            >
              Close Conversation
            </Button>
          )}

      </Flex>
        <Divider />
        {path=="/" ? <Footer
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          handleAudioMessage={handleAudioMessage}
        /> : null}
        <Modal isOpen={showThankYouModal} onClose={handleThankYouModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader textAlign="center">Thank You</ModalHeader>
            <ModalBody>
              <Text textAlign="center">
                {thankText}
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="green" onClick={handleThankYouModalClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
    </Flex>
  );
};

export default Chat;
