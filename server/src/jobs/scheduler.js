const agenda = require(".");

class JobScheduler {
    static async sendReminderToAttendees(data) {
        let timeToSend = new Date(data.eventDate);
        await agenda.schedule("in 1 minute", "remind-event-attendees", data);
       // agenda.now("remind-event-attendees", data);
    }
}
module.exports = JobScheduler