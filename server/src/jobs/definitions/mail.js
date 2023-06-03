const EventModel = require("../../models/Event.model");
const UserModel = require("../../models/User.model");

const mailDefinitions = (agenda) => {
    agenda.define("remind-event-attendees", async (job, done) => {
        const { data } = job.attrs;
        console.log(data)
        let { eventId } = data
        let event = await EventModel.findById(eventId)
        if (!event) throw new APIError(404, "event not found")
        let attendees = event.registeredUsers
        for (let i = 0; i < attendees.length; i++) {
            let attendee = attendees[i]
            let user = await UserModel.findById(attendee)
            if (!user) throw new APIError(404, "attendee not found")
            let { gmail, name } = user
            let content = {
                subject: "Event Reminder",
                content: `Hello ${name}, this is a reminder for the event ${event.title} on ${event.eventDate} about ${event.description}`
            }
            await sendMail(gmail, content);
        }
        done();
    });
    //    agenda.define(
    //       "remind-event-attendees",
    //       JobHandlers.sendReminderToAttendees
    //     );
};

module.exports = { mailDefinitions }