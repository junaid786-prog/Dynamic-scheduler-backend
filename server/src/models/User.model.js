const { default: mongoose } = require("mongoose")
const bcrypt = require("bcryptjs")
const APIError = require("../utility/ApiError")


const User = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name"],
        minLength: [2, "Name must be between 2 to 20 chars"],
        maxLength: [20, "Name must be between 2 to 20 chars"]
    },
    gmail: {
        type: String,
        required: [true, "Please enter gmail"],
    },
    password: {
        type: String,
        required: [true, "Please enter password"]
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    userType: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    savedEvents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "event"
        }
    ],
    status: {
        type: String,
        enum: ["confirmed", "pending"],
        default: "confirmed"
    }
})

User.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next()
    }
    this.password = await bcrypt.hash(this.password, 10)
  })
  
User.methods.comparePasswords = async function (password){
    let a = await bcrypt.compare(password, this.password)
    return a
}
User.statics.validateUser = function (name, gmail, password){
    if (!name) throw new APIError(401, "name field can not be empty")
    else if (!gmail) throw new APIError(401, "gmail field can not be empty")
    else if (!password) throw new APIError(401, "password field can not be empty")
    else return true
}
User.statics.checkUserExists = async function (gmail){
    if (!gmail) throw new APIError(401, "gmail field can not be empty")
    let user = await this.findOne({gmail})
    return user;
}
User.statics.findUserById = async function (id){
    if (!id) throw new APIError(401, "user id field can not be empty")
    let user = await this.findById(id)
    if (!user) throw new APIError(404, "user is not present with this id")
    return user;
}
User.statics.deleteUser = async function (gmail){
    if (!gmail) throw new APIError(401, "gmail field can not be empty")
    let user = await this.findOne({gmail})
    if (!user) throw new APIError(404, "user not found with this gmail")
    await this.deleteOne({gmail: gmail})
    return true
}
User.statics.createUser = async function (name, gmail, password, country){
    try{
        let user = await this.create({
            name,
            gmail,
            password,
            country,
        })
        return user
    } catch(err){
        throw new APIError(402, err)
    }
}
// update user type to seller
User.statics.changeModeToSeller = async function (gmail){
    if (!gmail) throw new APIError(401, "gmail field can not be empty")
    let user = await this.checkUserExists(gmail)
    if (!user) throw new APIError(404, "user not found with this gmail")
    user.userType = "seller"
    await user.save()
    return true
}

User.statics.saveEvent = async function (managerId, eventId){
    if (!managerId) throw new APIError(401, "managerId field can not be empty")
    if (!eventId) throw new APIError(401, "eventId field can not be empty")
    let user = await this.findById(managerId)
    if (!user) throw new APIError(404, "user not found with this id")
    for (let i = 0; i < user.savedEvents.length; i++) {
        if (user.savedEvents[i] == eventId) throw new APIError(402, "event already saved")
    }
    user.savedEvents.push(eventId)
    await user.save()
    return true
}
User.statics.removeFromSaved = async function (managerId, eventId){
    if (!managerId) throw new APIError(401, "managerId field can not be empty")
    if (!eventId) throw new APIError(401, "eventId field can not be empty")
    let user = await this.findById(managerId)
    if (!user) throw new APIError(404, "user not found with this id")
    for (let i = 0; i < user.savedEvents.length; i++) {
        if (user.savedEvents[i] == eventId) {
            user.savedEvents.splice(i, 1)
            await user.save()
            return true
        }
    }
}
module.exports = mongoose.model("user", User)