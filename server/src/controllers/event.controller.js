const stream = require("stream")
const EventModel = require("../models/Event.model");
const CatchAsync = require("../utility/CatchAsync");
const APIError = require("../utility/ApiError")
const cloudinary = require("cloudinary").v2
class BlogController {
    static recordsPerPage = 5
    // create a event
    static createEvent = CatchAsync(async (req, res) => {
        // title, description, category, poster, duration, eventDate, tags
        let { title, description, category, poster, duration, eventDate, tags } = req.body
        if (!req.file) throw new APIError(402, "poster image is required")

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
                    await BlogModel.createEvent(title, description, category, poster, duration, eventDate, tags)
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
        let docs = null

        docs = await EventModel.find({})
        res.status(200).json({
            success: true,
            eventsLength: docs?.length,
            events: docs
        })
    })
    // delete a blog post
    static deleteBlog = CatchAsync(async (req, res) => {
        let { blogId } = req.body

        let targetBlog = await BlogModel.getBlog(blogId)
        if (targetBlog) {
            await BlogModel.deleteBlog(blogId)
        } else {
            throw new APIError(404, "blog not found")
        }
        res.status(200).json({
            success: true,
            message: "Blog is successfully deleted"
        })
    })
    // update a blog post
    static updateBlog = CatchAsync(async (req, res) => {
        let { blogId } = req.body
        let { title, body, url, category } = req.body

        let targetBlog = await BlogModel.getBlog(blogId)

        if (!targetBlog) {
            throw new APIError(404, "blog not found")
        }

        let validBlog = BlogModel.validateBlog(title, body, url, category)

        if (!validBlog) {
            throw new APIError(402, "Validation error")
        }

        let updated = await targetBlog.updateBlog(title, body, url, category)
        if (!updated) throw new APIError(402, "Validation error")
        res.status(200).json({
            success: true,
            message: "Blog is successfully updated"
        })
    })
    // get a single blog
    static getSingleBlog = CatchAsync(async (req, res) => {
        let id = req.params.id

        let blog = await BlogModel.getBlog(id)
        if (!blog) throw new APIError(404, "no blog found against this id")
        res.status(200).json({
            success: true,
            blog
        })
    })
}

module.exports = BlogController