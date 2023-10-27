import express from "express";
import https from "https";
import { createSocketConnection } from "./core/socket-io.js";
import notificationEventRouter from "./routes/notifications.js";
import orderEventRouter from "./routes/ordersList.js";
import bookingListEventRouter from "./routes/bookings.js";
import mongoose from "mongoose";
import dontenv from "dotenv";
const app = express();
const PORT = 3013;

const server = https.createServer(app);
dontenv.config();
//  {
//   key: readFileSync("etc /letsencrypt/live/wss.eazyrooms.com/privkey.pem;"),
//   cert: readFileSync("/etc/letsencrypt/live/wss.eazyrooms.com/fullchain.pem;"),
// }
createSocketConnection(server);
await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

app.use(express.json());
app.use("/sendNoticationEvents", notificationEventRouter);
app.use("/sendOrderListEvents", orderEventRouter);
app.use("/sendBookingListEvents", bookingListEventRouter);

server.listen(PORT, () => {
  console.log(`socket server is running on port ${PORT}`);
});
