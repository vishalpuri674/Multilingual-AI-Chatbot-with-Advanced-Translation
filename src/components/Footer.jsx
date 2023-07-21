import { Flex, Input, Button } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import MicRecorder from "mic-recorder-to-mp3";

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const Footer = ({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  handleAudioMessage,
}) => {
  const [isRecording, setIsRecording] = useState(false);

  // const addAudioElement = (blob) => {
  //     console.log("blob: ", blob)
  //     const url = URL.createObjectURL(blob);
  //     console.log("url",url)
  //     // const audio = document.createElement('audio');
  //     // audio.src = url;
  //     // audio.controls = true;
  //     // document.body.appendChild(audio);
  //     handleAudioMessage(blob)
  // };

  useEffect(() => {
    // Request microphone access
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        // Handle microphone stream
        console.log('Microphone access granted');
        // Do something with the microphone stream
      })
      .catch((error) => {
        // Handle microphone access error
        console.error('Error accessing microphone:', error);
      });
  }, []);

  const startRecording = () => {

    Mp3Recorder.start()
      .then(() => {
        setIsRecording(true);
      })
      .catch((err) => console.error("Unable to start recording:", err));
    
  };

  const stopRecording = () => {
    Mp3Recorder.stop()
      .getMp3()
      .then(async ([buffer, blob]) => {
        setIsRecording(false);
        const blobURL = URL.createObjectURL(blob);
        const file = new File(buffer, "me-at-thevoice.mp3", {
          type: blob.type,
          lastModified: Date.now(),
        });

        // Send this file to your backend
        const formData = new FormData();
        formData.append("audio", file);
        handleAudioMessage(formData, blobURL);
      })
      .catch((err) => console.error("Unable to stop recording:", err));
  };

  // // Check for microphone permissions
  // navigator.getUserMedia(
  //   { audio: true },
  //   () => {
  //     console.log("Microphone Permission Granted");
  //     setIsBlocked(false);
  //   },
  //   () => {
  //     console.warn("Microphone Permission Denied");
  //     setIsBlocked(true);
  //   }
  // );
  return (
    <Flex w="100%" mt="5">
      {isRecording ? (
        <button onClick={stopRecording} disabled={!isRecording}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 100 100"
            id="microphone"
          >
            <path d="M52 75.9V86h14c1.1 0 2 .9 2 2s-.9 2-2 2H34c-1.1 0-2-.9-2-2s.9-2 2-2h14V75.9c-13.4-1-24-12.3-24-25.9 0-1.1.9-2 2-2s2 .9 2 2c0 12.1 9.9 22 22 22s22-9.9 22-22c0-1.1.9-2 2-2s2 .9 2 2c0 13.7-10.6 24.9-24 25.9zM65 25v25c0 8.3-6.7 15-15 15s-15-6.7-15-15V25c0-8.3 6.7-15 15-15s15 6.7 15 15zm-4 0c0-6.1-4.9-11-11-11s-11 4.9-11 11v25c0 6.1 4.9 11 11 11s11-4.9 11-11V25z"></path>
            <path
              fill="#00F"
              d="M1084-650v1684H-700V-650h1784m8-8H-708v1700h1800V-658z"
            ></path>
            <path
              stroke="#F00"
              stroke-width="2"
              d="M0 0L100 100M100 0L0 100"
            ></path>
          </svg>
        </button>
      ) : (
        <button onClick={startRecording} disabled={isRecording}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 100 100"
            id="microphone"
          >
            <path d="M52 75.9V86h14c1.1 0 2 .9 2 2s-.9 2-2 2H34c-1.1 0-2-.9-2-2s.9-2 2-2h14V75.9c-13.4-1-24-12.3-24-25.9 0-1.1.9-2 2-2s2 .9 2 2c0 12.1 9.9 22 22 22s22-9.9 22-22c0-1.1.9-2 2-2s2 .9 2 2c0 13.7-10.6 24.9-24 25.9zM65 25v25c0 8.3-6.7 15-15 15s-15-6.7-15-15V25c0-8.3 6.7-15 15-15s15 6.7 15 15zm-4 0c0-6.1-4.9-11-11-11s-11 4.9-11 11v25c0 6.1 4.9 11 11 11s11-4.9 11-11V25z"></path>
            <path
              fill="#00F"
              d="M1084-650v1684H-700V-650h1784m8-8H-708v1700h1800V-658z"
            ></path>
          </svg>
        </button>
      )}

      <Input
        placeholder="Type Something..."
        border="none"
        borderRadius="none"
        _focus={{
          border: "1px solid black",
        }}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />
      <Button
        bg="black"
        color="white"
        borderRadius="none"
        _hover={{
          bg: "white",
          color: "black",
          border: "1px solid black",
        }}
        disabled={inputMessage.trim().length <= 0}
        onClick={handleSendMessage}
      >
        Send
      </Button>
    </Flex>
  );
};

export default Footer;
