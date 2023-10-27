import { Server } from "socket.io";
// SSLCertificateFile /

// SSLCertificateKeyFile /
//   etc /
//   letsencrypt /
//   live /
//   wss.eazyrooms.com /
//   privkey.pem;
let io;
export const createSocketConnection = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(socket.id);
    socket.on("join", (data) => {
      console.log(data);
      if (data.usertype === "GUEST") {
        if (!data?.uid) return;
        socket.join(`GUEST_${data?.uid}`);
        console.log("joined", data?.uid);
        emitMessage({
          roomId: `GUEST_${data?.uid}`,
          type: "GUEST_CONNECTED",
          message: `Hello Guest ${data?.uid}`,
        });
      } else {
        if (!data?._id) return;
        socket.join(`USER_${data?._id}`);
        console.log("joined", data?._id);
        emitMessage({
          roomId: `USER_${data?._id}`,
          type: "USER_CONNECTED",
          message: `Hello User ${data?._id}`,
        });
      }
    });
  });
};

export const emitMessage = ({ roomId, type, message }) => {
  console.log({ roomId, type, message });
  try {
    io.to(roomId).emit(type, message);
  } catch (err) {}
};
