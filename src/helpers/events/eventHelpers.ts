import mongoose from "mongoose";
import { config } from "../../config/index";
import { Event } from "../../models";
import { ThrowError } from "../../classes";
import { IRoles } from "../../types/default";

const { isValidObjectId } = mongoose;
const { NODE_ENV } = config.SERVER;

/**
 * To get all events
 * @returns {Events} events
 */
export const getEvents = (role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = ["SuperAdmin", "Developer"].includes(role ?? "")
        ? { isDeleted: true }
        : {};
      const events = await Event.find({ ...query }).sort({
        createdAt: -1,
      });

      resolve({
        message: "Events Fetched",
        events,
      });
    } catch (error: any) {
      return reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To get a particular event by id
 * @param {String} eventId
 * @returns {Event} event
 */
export const getEvent = (eventId: string, role?: IRoles) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!eventId || !isValidObjectId(eventId))
        throw new ThrowError("Provide vaild event id", 404);

      const query = ["SuperAdmin", "Developer"].includes(role ?? "")
        ? { isDeleted: true }
        : {};
      const event = await Event.findOne({ _id: eventId, ...query });

      if (!event) {
        return reject({
          message: "Event not found",
          statusCode: 404,
        });
      }
      resolve({ message: "Event fetched", event });
    } catch (error: any) {
      return reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To add a new event
 * @param {Event} data
 * @returns event
 */
export const addEvent = (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { title, desc, date, time, visibility } = data;
      if (!title || !desc || !date || !time || !visibility)
        throw new ThrowError(
          "Please Provide title, desc, date, time and visibility",
          400
        );

      const eventExists = await Event.findOne({
        title: title,
      });

      if (eventExists) throw new ThrowError("Event title already exist!", 401);

      const event = await new Event({
        title,
        desc,
        date: new Date(),
        visibility: "Show",
      });

      const nevent = await event.save();

      resolve({
        message: "Event created successfully",
        event: nevent,
      });
    } catch (error: any) {
      return reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To edit a event
 * @param {String} eventId
 * @param {Event} data
 * @returns
 */
export const editEvent = (eventId: string, data: any, client: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!eventId || !isValidObjectId(eventId))
        throw new ThrowError("Provide vaild event id", 400);

      const event = await Event.findById(eventId);

      if (!event) throw new ThrowError("Event not found", 404);

      const { title, desc, date, visibility } = data;

      // New title is already exist from another event then
      if (title && event.title != title) {
        const eventExists = await Event.findOne({
          title,
        });
        if (eventExists)
          throw new ThrowError("Title already exist for other event", 400);
      }

      // Update a values in db
      event.title = title || event.title;
      event.desc = desc || event.desc;
      event.date = date || event.date;
      event.visibility = visibility || event.visibility;

      const nevent = await event.save();

      resolve({ message: "Event edited successfully", event: nevent });
    } catch (error: any) {
      return reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To change a visibility for event
 * @param {String} eventId
 * @returns {Event} event
 */
export const changeEventVisibility = (eventId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!eventId || !isValidObjectId(eventId)) {
        return reject({
          message: "Provide vaild event id",
          statusCode: 404,
        });
      }

      const event = await Event.findById(eventId);
      if (!event) throw new ThrowError("Event not found", 404);

      event.visibility = event.visibility === "Show" ? "Hide" : "Show";

      const nevent = await event.save();

      resolve({
        message: `${nevent.title}'s visibility changed to ${nevent.visibility}`,
        event: nevent,
      });
    } catch (error: any) {
      return reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To delete a non deleted event temporarily
 * @param {String} eventId
 */
export const deleteEvent = (eventId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!eventId || !isValidObjectId(eventId))
        throw new ThrowError("Provide valid event id", 400);

      const event = await Event.findOne({
        _id: eventId,
        isDeleted: false,
      });

      if (!event) throw new ThrowError("Event not found", 404);

      event.visibility = "Show";
      event.isDeleted = true;
      event.deletedAt = new Date();

      await event.save();

      resolve({
        message: `${event.title} event was deleted`,
      });
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To restore a deleted event
 * @param {String} eventId
 * @returns event
 */
export const restoreEvent = (eventId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!eventId || !isValidObjectId(eventId))
        throw new ThrowError("Provide valid event id", 400);

      const event = await Event.findOne({
        _id: eventId,
        isDeleted: true,
      });

      if (!event) {
        return reject({
          message: "Event not found",
          statusCode: 404,
        });
      }

      event.visibility = "Show";
      event.isDeleted = false;
      event.deletedAt = undefined;

      const nevent = await event.save();

      resolve({
        message: `${nevent.title} event was restored`,
        event: nevent,
      });
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To delete a event permanently
 * @param {String} eventId
 */
export const pDeleteEvent = (eventId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!eventId || !isValidObjectId(eventId))
        throw new ThrowError("Provide valid event id", 400);

      const event = await Event.findOne({
        _id: eventId,
        isDeleted: true,
      });

      if (!event) {
        return reject({
          message: "Event not found",
          statusCode: 404,
        });
      }

      if (NODE_ENV === "development") {
        await event.deleteOne();
        return resolve({
          message: `${event.title} category was deleted`,
        });
      }
      throw new ThrowError(
        `Not able to delete category in ${NODE_ENV} mode`,
        401
      );
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};

/**
 * To delete all event in development mode
 */
export const deleteAllEvent = () => {
  return new Promise(async (resolve, reject) => {
    try {
      if (NODE_ENV === "development") {
        await Event.deleteMany({});
        return resolve({ message: "All event deleted" });
      }
      throw new ThrowError(
        `Not able to delete all events in ${NODE_ENV} mode`,
        401
      );
    } catch (error: any) {
      reject({
        message: error.message || error.msg,
        statusCode: error.statusCode,
        code: error.code || error.name,
      });
    }
  });
};
