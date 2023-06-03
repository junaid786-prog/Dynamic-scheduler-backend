const stream = require("stream")
const EventModel = require("../models/Event.model");
const CatchAsync = require("../utility/CatchAsync");
const APIError = require("../utility/ApiError");
const UserModel = require("../models/User.model");
const UserToStore = require("../utility/Profile");
const cloudinary = require("cloudinary").v2

const JobScheduler = require("../jobs/scheduler");
const { sendMail } = require("../utility/mailVerification");
class EventController {
    static recordsPerPage = 5
    // create a event
    static createEvent = CatchAsync(async (req, res) => {
        // title, description, category, poster, duration, eventDate, tags
        console.log(req.body)
        let { title, description, category, duration, eventDate, tags, attendeesLimit } = req.body
        if (!req.file) throw new APIError(402, "poster image is required")

        // if (!UserToStore.getUserFromSession(req)) {
        //     throw new APIError(401, "login first to access this")
        // }
        // let user = await UserModel.checkUserExists(UserToStore?.getUserFromSession(req)?.email)
        // if (!user) throw new APIError(404, "user not found")
        let user = {
            _id: "647aeb4361ae82293336d7ad"
        }
        let manager = user._id
        let validEvent = EventModel.validateEvent(title, description, category, "poster", duration, eventDate)

        // upload image
        const readableStream = new stream.PassThrough();
        readableStream.end(req.file.buffer);

        try {
            console.log(process.env.CLOUD_NAME, process.env.CLOUD_API_KEY, process.env.CLOUD_API_SECRET)
            cloudinary.config({
                cloud_name: "dhakn858r",
                api_key: "852837123684298",
                api_secret: "zrpmN43rlZCZ6gdJ0ToKTxrUnSc"
            })
            const options = {
                folder: "events_images",
                crop: "scale",
                public_id: `${Date.now()}`,
                resource_type: "auto",
            }
            const uploadStream = cloudinary.uploader.upload_stream(options, async (error, result) => {
                if (error) {
                    return res.status(500).send('Failed to upload file to Cloudinary');
                }
                let myEvent = null
                console.log(result.secure_url);
                if (validEvent) {
                    myEvent = await EventModel.createEvent(title, description, category, result.secure_url, duration, eventDate, tags, manager, attendeesLimit)
                } else {
                    throw new APIError(402, "Validation error")
                }
                let data = {
                    eventDate: eventDate,
                    eventId: myEvent?._id
                }
                await JobScheduler.sendReminderToAttendees(data)
                res.status(200).json({
                    success: true,
                    message: "Event is successfully created"
                })
            });
            readableStream.pipe(uploadStream);
        } catch (err) {
            console.log(err)
            throw new APIError(500, "Internal server error - cloudinary")
        }
    })
    // get all blogs
    static getAllEvents = CatchAsync(async (req, res) => {
        let category = req.query.category || ""
        let title = req.query.title || ""
        let pageNo = req.query.page || 1

        let query
        if (category && title) {
            query = {
                "title": title,
                "category": category
            }
        } else if (!category && title) {
            query = {
                "title": title
            }
        } else if (category && !title) {
            query = {
                "category": category
            }
        }

        let events = await EventModel.find(query).sort({ _id: -1 }).skip((pageNo - 1) * this.recordsPerPage)
            .limit(this.recordsPerPage)

        res.status(200).json({
            success: true,
            page: pageNo,
            eventsLength: events.length,
            events
        })
    })

    static getSavedEvents = CatchAsync(async (req, res) => {
        if (!UserToStore.getUserFromSession(req)) {
            throw new APIError(401, "login first to access this")
        }
        let user = await UserModel.checkUserExists(UserToStore?.getUserFromSession(req)?.email)
        if (!user) throw new APIError(404, "user not found")
        
        let savedEvents = user.savedEvents

        let docs = []

        for (let i = 0; i < savedEvents.length; i++) {
            let event = await EventModel.getEvent(savedEvents[i])
            docs.push(event)
        }
        res.status(200).json({
            success: true,
            eventsLength: docs?.length,
            events: docs
        })
    })
    // delete a event
    static deleteEvent = CatchAsync(async (req, res) => {
        let { eventId } = req.body
        let targetEvent = await EventModel.getEvent(eventId)

        if (!UserToStore.getUserFromSession(req)) {
            throw new APIError(401, "login first to access this")
        }
        let user = await UserModel.checkUserExists(UserToStore?.getUserFromSession(req)?.email)
        if (!user) throw new APIError(404, "user not found")
        let manager = user._id
        if (targetEvent) {
            await EventModel.deleteEvent(eventId, manager)
        } else {
            throw new APIError(404, "event not found")
        }
        res.status(200).json({
            success: true,
            message: "Blog is successfully deleted"
        })
    })
    // update a blog post
    static updateEvent = CatchAsync(async (req, res) => {
        let { eventId } = req.body
        let { title, description, category } = req.body

        let targetEvent = await EventModel.getEvent(eventId)

        if (!targetEvent) {
            throw new APIError(404, "event not found")
        }

        let updated = await targetEvent.updateEvent(title, description, category)
        if (!updated) throw new APIError(402, "Validation error")
        res.status(200).json({
            success: true,
            message: "Blog is successfully updated"
        })
    })
    // get a single blog
    static getSingleEvent = CatchAsync(async (req, res) => {
        let id = req.params.id

        let event = await EventModel.getEvent(id)
        if (!event) throw new APIError(404, "event not found")
        res.status(200).json({
            success: true,
            event
        })
    })
    // join an event
    static joinEvent = CatchAsync(async (req, res) => {
        let { eventId } = req.body

        // if (!UserToStore.getUserFromSession(req)) {
        //     throw new APIError(401, "login first to access this")
        // }
        // let user = await UserModel.checkUserExists(UserToStore?.getUserFromSession(req)?.email)
        //if (!user) throw new APIError(404, "user not found")
        let userId = "647aeb4361ae82293336d7ad"
        let event = await EventModel.getEvent(eventId)
        if (!event) throw new APIError(404, "event not found")
        await event.joinEvent(userId)
        // send confirmation mail
        res.status(200).json({
            success: true,
            message: "User joined the event"
        })
    })

    static saveEvent = CatchAsync(async (req, res) => {
        let { eventId } = req.body
        // if (!UserToStore.getUserFromSession(req)) {
        //     throw new APIError(401, "login first to access this")
        // }
        // let user = await UserModel.checkUserExists(UserToStore?.getUserFromSession(req)?.email)
        //if (!user) throw new APIError(404, "user not found")
        let userId = "647aeb4361ae82293336d7ad"
        let event = await EventModel.getEvent(eventId)
        if (!event) throw new APIError(404, "event not found")
        await UserModel.saveEvent(userId, eventId)
        // send confirmation mail
        res.status(200).json({
            success: true,
            message: "You have added the event to wishList"
        })
    })

    static getRegisteredUsers = CatchAsync(async (req, res) => {
        let { eventId } = req.body
        let event = await EventModel.getEvent(eventId)
        if (!event) throw new APIError(404, "event not found")
        let registeredUsers = event.registeredUsers
        let docs = []
        for (let i = 0; i < registeredUsers.length; i++) {
            let user = await UserModel.findById(registeredUsers[i])
            docs.push(user)
        }
        res.status(200).json({
            success: true,
            usersLength: docs.length,
            users: docs
        })
    })

    static cancelSpecificEvent = CatchAsync(async (req, res) => {
        let { eventId } = req.body
        let userFromSession = UserToStore.getUserFromSession(req)

        if (!userFromSession) throw new APIError(401, "login first to access this")
        let {email} = userFromSession
        let user = await UserModel.checkUserExists(email)
        if (!user) throw new APIError(404, "user not found")
        let event = await EventModel.getEvent(eventId)
        if (!event) throw new APIError(404, "event not found")

        console.log(user, event.managerId)
        if (event.managerId.toString() !== user?._id?.toString()) throw new APIError(401, "you are not authorized to cancel this event")

        let attendees = event.registeredUsers
        await EventModel.deleteOne({ _id: eventId })

        for (let i = 0; i < attendees.length; i++) {
            let attendee = attendees[i]
            let user = await UserModel.findById(attendee)
            if (!user) throw new APIError(404, "attendee not found")
            let { gmail, name } = user
            let content = {
                subject: "Event Cancellation",
                content: `Hello ${name}, this is to inform you that the event ${event.title} on ${event.eventDate} about ${event.description} is cancelled.`
            }
            await sendMail(gmail, content);
        }
        res.status(200).json({
            success: true,
            message: "Event is successfully cancelled"
        })
    })
}

module.exports = EventController