const AuthController = require("../controllers/auth.controller")
const { isLoggedIn } = require("../middelwares/Authorization")

const Router   = require("express").Router()

Router.route("/register").post(AuthController.register)
Router.route("/login").post(AuthController.login)
Router.route("/logout").get(AuthController.logout)
Router.route("/user").get(AuthController.getProfile)
Router.route("/user/change/role").put(isLoggedIn, AuthController.changeModeToSeller)
module.exports = Router

// TODOs

// verify gmail (RabitMQ)
// forget password
// change password
// update profile