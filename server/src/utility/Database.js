const { default: mongoose } = require("mongoose")

class Database {
    static connectDB = async ()=>{
        try{
            await mongoose.connect("mongodb://localhost/Events-management", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            console.log("DB CONNECTED!")
        }catch(err){
            console.log(err)
        }
    }
}

module.exports = Database