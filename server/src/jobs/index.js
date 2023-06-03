const Agenda = require("agenda");
const env = process.env.NODE_ENV || "development";
const { allDefinitions } = require("./definitions");

// establised a connection to our mongoDB database.
const agenda = new Agenda({
    db: {
        address: "mongodb://localhost/Events-management",
        collection: "agendaJobs",
        options: { useUnifiedTopology: true },
    },
});

// listen for the ready or error event.
agenda
    .on("ready", () => console.log("Agenda started!"))
    .on("error", () => console.log("Agenda connection error!"));

// define all agenda jobs
allDefinitions(agenda);

// logs all registered jobs 
console.log({ jobs: agenda._definitions });

module.exports = agenda;