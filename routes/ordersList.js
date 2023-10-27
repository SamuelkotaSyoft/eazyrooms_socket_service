import express from "express";
import guestModel from "../models/guestModel.js";
import { emitMessage } from "../core/socket-io.js";
import storeModel from "../models/storeModel.js";
import UserModal from "../models/userModel.js";
const router = express.Router();

const setOrderEvents = async (req, res) => {
  try {
    const {
      orderId,
      storeId,
      guest = null,
      status = null,
      staffId = null,
      includeAllStaff = false,
    } = req.body;
    console.log({ staffId });
    if (guest) {
      const guestDetails = await guestModel.findOne({ _id: guest });
      emitMessage({
        roomId: `GUEST_${guestDetails?.uid}`,
        type: "ORDER_STATUS_UPDATED",
        message: {
          type: "ORDER_STATUS_UPDATED",
          orderId: orderId,
          storeId: storeId,
          status: status,
        },
      });
    }
    const store = await storeModel.findOne({ _id: storeId });
    let users = [];
    const propertyAdmin = await UserModal.findOne({
      property: store.property,
      role: "propertyAdmin",
    });
    const locationAdmin = await UserModal.findOne({
      property: store.property,
      role: "locationAdmin",
    });

    const storeAdmin = await UserModal.findOne({
      stores: { $in: [store._id] },
      role: "storeAdmin",
    });
    users.push(locationAdmin);
    users.push(propertyAdmin);
    users.push(storeAdmin);
    if (includeAllStaff) {
      const staffUsers = await UserModal.find({
        stores: { $in: [store._id] },
        role: "staff",
      });
      users = [...users, ...staffUsers];
    }
    if (staffId) {
      const staffUser = await UserModal.findOne({
        _id: staffId,
        role: "staff",
      });
      users.push(staffUser);
    }
    users?.map((user) => {
      emitMessage({
        roomId: `USER_${user?._id}`,
        type: "ORDER_LIST_UPDATED",
        message: {
          type: "ORDER_LIST_UPDATED",
          orderId: orderId,
          storeId: storeId,
        },
      });
    });
    res.status(200).json({ status: true });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

router.post("/", setOrderEvents);
export default router;
