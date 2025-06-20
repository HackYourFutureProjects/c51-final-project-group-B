import Feed from "../models/Feed.js";
import { logError } from "../util/logging.js";
import { getIo } from "../socket.js";
import { User } from "../models/User.js";
import { notifyUser } from "../services/notifications.js";

export const createFeed = async (req, res) => {
  try {
    const allowedIds = process.env.ADMIN_IDS
      ? process.env.ADMIN_IDS.split(",")
      : [];
    if (!allowedIds.includes(req.user.id)) {
      return res.status(403).json({ success: false, msg: "Forbidden" });
    }

    const { title, tags, content, sources, media, audience } = req.body;

    const feed = new Feed({
      title,
      tags,
      author: req.user.id,
      content,
      sources,
      media,
      audience,
    });

    await feed.save();

    // Notification part starts here
    const io = getIo();

    const notificationData = {
      type: "new_feed",
      title: "New Feed Available",
      message: `A feed "${title}" is now available.`,
      data: {
        fromUserId: req.user.id,
        metadata: {
          feedTitle: title,
          feedSummary: content.slice(0, 100),
        },
      },
    };

    let usersToNotify = [];

    if (audience === "all") {
      usersToNotify = await User.find().lean();
    } else if (audience === "company" || audience === "seeker") {
      usersToNotify = await User.find({ userType: audience }).lean();
    }

    await Promise.all(
      usersToNotify.map((user) =>
        notifyUser(io, user._id.toString(), notificationData),
      ),
    );
    // Notification part ends here

    res.status(201).json({ success: true, data: feed });
  } catch (err) {
    logError(err);
    res.status(400).json({ success: false, msg: err.message });
  }
};

// get feeds based on audience type and authenticated users
export const getAuthFeeds = async (req, res) => {
  try {
    if (!req.user || !["seeker", "company"].includes(req.user.userType)) {
      return res.status(403).json({ success: false, msg: "Forbidden" });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();

    let audienceFilter = ["all"];
    if (req.user.userType === "seeker") {
      audienceFilter.push("seeker");
    } else if (req.user.userType === "company") {
      audienceFilter.push("company");
    }

    //  search filter
    let filter = { audience: { $in: audienceFilter } };
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ title: regex }, { tags: regex }];
    }

    const feeds = await Feed.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ success: true, data: feeds, page });
  } catch (err) {
    logError(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ success: false, msg: err.message });
    }
    res.status(500).json({ success: false, msg: err.message });
  }
};

// get public feeds that are accessible to all users inculding unauthenticated users
export const getPublicFeeds = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.max(1, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const search = req.query.search?.trim();

    let filter = { audience: "all" };
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ title: regex }, { tags: regex }];
    }

    const feeds = await Feed.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ success: true, data: feeds, page });
  } catch (err) {
    logError(err);
    res.status(500).json({ success: false, msg: err.message });
  }
};
