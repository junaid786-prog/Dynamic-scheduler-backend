const { agenda } = require("./index")

class JobScheduler {
    static async sendReminderToAttendees(data) {
        await agenda.now("remind-event-attendees", data);
    }
}
module.exports = JobScheduler