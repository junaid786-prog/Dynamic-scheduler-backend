
const EventController = require("../controllers/event.controller")
const upload = require("../utility/Multer")

const Router = require("express").Router()

Router.route("/events").get(EventController.getAllEvents)
Router.route("/events/saved").get(EventController.getSavedEvents)
Router.route("/events/:id").get(EventController.getSingleEvent)
Router.route("/event/create").post(upload.single("image"), EventController.createEvent)
Router.route("/event/update").post(EventController.updateEvent)
Router.route("/event/delete").post(EventController.deleteEvent)
Router.route("/event/join").post(EventController.deleteEvent)

module.exports = Router
