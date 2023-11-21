import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import styled from "@emotion/styled";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import toolbarOptions from "../toolbar";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const Component = styled.div`
  background: #f5f5f5;
`;
function Editor(props) {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const { id } = useParams();
  const uri = process.env.REACT_APP_BACKEND;

  // Start the quill Server
  useEffect(() => {
    const quillServer = new Quill("#container", {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    quillServer.disable();
    quillServer.setText("Loading the document.....");
    setQuill(quillServer);
  }, []);

  // Start the socket Server
  useEffect(() => {
    const socketServer = io(uri);
    setSocket(socketServer);
    console.log(socketServer);

    return () => {
      socketServer.disconnect();
    };
  }, [uri]);

  // Load Documents
  useEffect(() => {
    if (socket === null || quill === null) return;

    socket &&
      socket.once("load-document", (document) => {
        quill && quill.setContents(document);
        quill && quill.enable();
      });

    socket && socket.emit("get-document", id);
  }, [quill, socket, id]);

  // Send changes in document
  useEffect(() => {
    if (socket === null || quill === null) return;

    const handleChange = (delta, oldData, source) => {
      if (source !== "user") return;
      socket && socket.emit("send-changes", delta);
    };

    quill && quill.on("text-change", handleChange);

    return () => {
      quill && quill.off("text-change", handleChange);
    };
  }, [quill, socket]);

  // Receive and update changes
  useEffect(() => {
    if (socket === null || quill === null) return;

    const handleChange = (delta) => {
      quill.updateContents(delta);
    };

    socket && socket.on("receive-changes", handleChange);

    return () => {
      socket && socket.off("receive-changes", handleChange);
    };
  }, [quill, socket]);

  // Save Document
  useEffect(() => {
    if (socket === null || quill === null) return;

    const interval = setInterval(() => {
      socket && socket.emit("save-document", quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [quill, socket]);

  return (
    <Component>
      <Box className="container" id="container"></Box>
    </Component>
  );
}

export default Editor;
