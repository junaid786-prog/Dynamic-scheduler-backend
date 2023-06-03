const mongoose = require("mongoose")
const APIError = require("../utility/ApiError")

const Event = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "title field can not be empty"],
        maxLength: [200, "event title must be less than 200 chars"],
        minLength: [1, "event title must be more than 1 chars"],
    },
    description: {
        type: String,
        required: [true, "event body field can not be empty"],
        minLength: [1, "event description must be between 1 to 100000"],
        maxLength: [100000, "event description must be between 1 to 100000"]
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    poster: [{
        type: String,
        required: ["true", "poster url can  not be empty"]
    }],
    category: {
        type: String,
        required: [true, "event must have one category"]
    },
    tags: [{
        type: String,
    }],
    duration: {
        type: Date,
        required: [true, "event must have duration"]
    },
    eventDate: {
        type: Date,
        required: [true, "event must have date"]
    },
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    registeredUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ]
})

Event.statics.validateEvent = function (title, description, category, poster, duration, eventDate) {
    if (!title) throw new APIError(402, "title field can not be empty")
    else if (!description) throw new APIError(402, "description field can not be empty")
    else if (!category) throw new APIError(402, "category field can not be empty")
    else if (!poster) throw new APIError(402, "poster field can not be empty")
    else if (!duration) throw new APIError(402, "duration field can not be empty")
    else if (!eventDate) throw new APIError(402, "eventDate field can not be empty")
    else return true
}

Event.statics.createEvent = async function (title, description, category, poster, duration, eventDate, tags, managerId) {
    try {
        await this.create({
            title,
            description,
            category,
            poster,
            duration,
            eventDate,
            tags,
            managerId
        })
    } catch (err) {
        throw new APIError(402, err)
    }
}

Event.statics.getEvent = async function (eventId) {
    return await this.findById(eventId)
}

Event.statics.deleteEvent = async function (eventId) {
    try {
        let event = await this.findById(eventId, managerId)
        if (!event) throw new APIError(404, "event not found")
        if (event.managerId !== managerId) throw new APIError(401, "you are not authorized to delete this event")
        await this.findByIdAndDelete(eventId)
    } catch (err) {
        throw new APIError(404, "event not found or issue")
    }
}

Event.methods.updateEvent = async function (title, description, category) {
    try {
        if (title) this.title = title
        if (description) this.description = description
        if (category) this.category = category

        await this.save()
        return true
    } catch (err) {
        throw new APIError(402, "event can't be updated")
    }
}

Event.methods.joinEvent = async function (userId) {
    if (!userId) {
        throw new APIError(402, "userId can not be empty")
    }
    try {
        this.registeredUsers.push(userId)
        await this.save()
    } catch (err) {
        throw new APIError(402, "event can't be updated")
    }
}

module.exports = mongoose.model("event", Event)