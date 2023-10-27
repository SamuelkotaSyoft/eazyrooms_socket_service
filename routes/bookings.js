import express from "express";
import guestModel from "../models/guestModel.js";
import { emitMessage } from "../core/socket-io.js";
import storeModel from "../models/storeModel.js";
import UserModal from "../models/userModel.js";
import bookingModel from "../models/bookingModel.js";
const router = express.Router();

const setBookingsEvent = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await bookingModel.findOne({ _id: bookingId });
    let users = [];
    const propertyAdmin = await UserModal.findOne({
      property: booking.property,
      role: "propertyAdmin",
    });
    const locationAdmin = await UserModal.findOne({
      property: booking.property,
      role: "locationAdmin",
    });

    users.push(locationAdmin);
    users.push(propertyAdmin);
    users?.map((user) => {
      emitMessage({
        roomId: `USER_${user?._id}`,
        type: "BOOKING_LIST_UPDATED",
        message: {
          type: "BOOKING_LIST_UPDATED",
          bookingId: bookingId,
        },
      });
    });
    res.status(200).json({ status: true });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

router.post("/", setBookingsEvent);
export default router;
