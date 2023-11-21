import { Server } from "socket.io";
import Connection from "./database/db.js";
import {
  getDocument,
  updateDocument,
} from "./controller/document-controller.js";
import "dotenv/config";

const PORT = process.env.PORT || 9000;
Connection();

const io = new Server(PORT, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await getDocument(documentId);
    const data = document.data;

    socket.join(documentId);
    socket.emit("load-document", data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async (data) => {
      await updateDocument(documentId, data);
    });
  });
});
