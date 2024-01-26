const { Nominal } = require("../models/Nominal");
const { catchAsyncError } = require("../utils/catchAsyncError");
const { ErrorHandler } = require("../utils/errorHandler");

/**
 * Event controller to get all available events
 */
exports.getAllEvents = catchAsyncError(async (req, res, next) => {
  const response = await fetch(process.env.EVENT_API + "event");
  if (!response.ok) throw new ErrorHandler("Internal server error", 500);
  const resData = await response.json();
  resData.events.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  res.status(200).json(resData);
});

/**
 * To get event details and its report
 * Report will include
 * 1) General event details (name, description, venue, date etc)
 * 2) Attendace and its metrics (Only for Rank panel)
 */
exports.getEventDetails = catchAsyncError(async (req, res, next) => {
  const eventID = req.params.id;
  // Fetch event report
  const response = await fetch(process.env.EVENT_API + "event/" + eventID);
  if (response.status === 404) {
    throw new ErrorHandler("Event does not exist", 404);
  }
  if (!response.ok) {
    throw new ErrorHandler("Internal server error", 500);
  }
  const resData = await response.json();
  // Calculate metrics only if cadet has rank above LCPL
  if (req.cadet.rank !== "CDT" && req.cadet.rank !== "LCPL") {
    // Calculating event metrics
    if (resData.event.attendance.attendes.length > 0) {
      resData.metrics = resData.event.attendance.attendes.reduce(
        (metrics, attendee) => {
          let tp = metrics.totalPresent || 0;
          let ta = metrics.totalAbsent || 0;
          if (attendee.status === "A") {
            ta++;
          } else {
            tp++;
          }
          return {
            totalPresent: tp,
            totalAbsent: ta,
            totalResponse: metrics.totalResponse + 1,
          };
        },
        { totalPresent: 0, totalAbsent: 0, totalResponse: 0 }
      );
    } else {
      resData.metrics = { totalPresent: 0, totalAbsent: 0, totalResponse: 0 };
    }
  } else {
    resData.event.attendance = undefined;
  }

  res.status(200).json(resData);
});

/**
 * Create an event
 * 1) Get event details
 * -- eventName
 * -- eventType
 * -- description
 * -- date
 * -- venue
 * and
 * -- Nominal roll data
 * 2) Make an event using events API
 * 3) Store event id and Nominal roll data in Nominal collections db
 * 4) Send success response back to user or error response if there is
 */
exports.createEvent = catchAsyncError(async (req, res, next) => {
  const { eventName, eventType, description, date, venue } = req.body;
  if (!eventName || !eventType || !description || !date || !venue)
    throw new ErrorHandler("Provide all required fields", 422);
  const eventObj = {
    eventName,
    eventType,
    description,
    date,
    venue,
  };

  const response = await fetch(process.env.EVENT_API + "event", {
    method: "POST",
    body: JSON.stringify(eventObj),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new ErrorHandler("Internal server error", 500);
  const resData = await response.json();

  res.status(200).json({
    success: true,
    event: resData.createdEvent,
  });
});

/**
 * To update event details
 */
exports.updateEvent = catchAsyncError(async (req, res, next) => {});

/**
 * To delete an event
 * It deletes event using /:id, route parameter
 * It sends a delete request to Events API
 */
exports.deleteEvent = catchAsyncError(async (req, res, next) => {
  const eventID = req.params.id;
  const response = await fetch(process.env.EVENT_API + "event/" + eventID, {
    method: "DELETE",
  });
  if (!response.ok) throw new ErrorHandler("Cannot delete event", 500);
  res.status(200).json({
    success: true,
    message: "Event deleted successfully",
  });
});
