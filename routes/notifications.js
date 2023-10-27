import express from "express";
import guestModel from "../models/guestModel.js";
import { emitMessage } from "../core/socket-io.js";
const router = express.Router();

const sendNotifictionEvents = async (req, res) => {
  try {
    const { guest, users } = req.body;
    console.log({ guest }, "guest");
    if (guest?.id) {
      const guestDetails = await guestModel.findOne({ _id: guest?.id });
      emitMessage({
        roomId: `GUEST_${guestDetails?.uid}`,
        type: "NOTIFICATIONS_UPDATED",
        message: {
          type: "NOTIFICATIONS_UPDATED",
        },
      });
    }
    if (users?.length > 0) {
      users.forEach((user) => {
        emitMessage({
          roomId: `USER_${user?._id}`,
          type: "NOTIFICATIONS_UPDATED",
          message: {
            type: "NOTIFICATIONS_UPDATED",
          },
        });
      });
    }
    res.status(200).json({ status: true });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

router.post("/", sendNotifictionEvents);
export default router;
