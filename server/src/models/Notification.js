import mongoose, { Schema, model } from "mongoose";

import { NOTIFICATION_TYPES, PERIOD } from "../constants.js";

const notificationSchema = new Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: NOTIFICATION_TYPES,
    },

    title: {
      type: String,
      required: true,
      maxLength: 100,
    },

    message: {
      type: String,
      required: true,
      maxLength: 500,
    },

    data: {
      jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JobPost",
      },
      applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
      fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      /** This field is super it helps us to avoid api calls from frontend
       * and multiple queries from BE, one query fetches all
       * info needed to render the notification.
       * */
      metadata: {
        type: mongoose.Schema.Types.Mixed,
      },
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },

    readAt: {
      type: Date,
    },

    expireAt: {
      type: Date,
      default: () => new Date(Date.now() + PERIOD),
    },
  },
  {
    timestamps: true,
  },
);

notificationSchema.pre("save", function (next) {
  if (this.isRead && !this.readAt) {
    this.readAt = new Date();
  }
  next();
});

const Notification = model("Notification", notificationSchema);

export default Notification;
