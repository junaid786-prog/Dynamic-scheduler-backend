const stream = require("stream")
const EventModel = require("../models/Event.model");
const CatchAsync = require("../utility/CatchAsync");
const APIError = require("../utility/ApiError");
const UserModel = require("../models/User.model");
const cloudinary = require("cloudinary").v2
class EventController {
    static recordsPerPage = 5
    // create a event
    static createEvent = CatchAsync(async (req, res) => {
        // title, description, category, poster, duration, eventDate, tags
        let { title, description, category, poster, duration, eventDate, tags } = req.body
        if (!req.file) throw new APIError(402, "poster image is required")

        if (!UserToStore.getUserFromSession(req)) {
            throw new APIError(401, "login first to access this")
        }
        let user = await UserModel.checkUserExists(UserToStore?.getUserFromSession(req)?.email)
        if (!user) throw new APIError(404, "user not found")
        let manager = user._id
        let validBlog = BlogModel.validateEvent(title, description, category, poster, duration, eventDate)

        // upload image
        const readableStream = new stream.PassThrough();
        readableStream.end(req.file.buffer);

        try {
            cloudinary.config({
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.CLOUD_API_KEY,
                api_secret: process.env.CLOUD_API_SECRET,
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
                let myCloud = result
                console.log(result.secure_url);
                if (validBlog) {
                    await BlogModel.createEvent(title, description, category, poster, duration, eventDate, tags, manager)
                } else {
                    throw new APIError(402, "Validation error")
                }
                res.status(200).json({
                    success: true,
                    message: "Event is successfully created"
                })
            });
            readableStream.pipe(uploadStream);
        } catch (err) {
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
        savedEvents.forEach(async (eventId, index) => {
            let event = await EventModel.findById(eventId)
            docs.push(event)
        })
        res.status(200).json({
            success: true,
            eventsLength: docs?.length,
            events: docs
        })
    })
    // delete a event
    static deleteEvent = CatchAsync(async (req, res) => {
        let { eventId } = req.body
        let targetEvent = await BlogModel.getEvent(blogId)

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

        if (!UserToStore.getUserFromSession(req)) {
            throw new APIError(401, "login first to access this")
        }
        let user = await UserModel.checkUserExists(UserToStore?.getUserFromSession(req)?.email)
        if (!user) throw new APIError(404, "user not found")
        let userId = user._id
        let event = await EventModel.getEvent(eventId)
        if (!event) throw new APIError(404, "event not found")
        await event.joinEvent(userId)
        res.status(200).json({
            success: true,
            message: "User joined the event"
        })
    })
}

module.exports = EventController