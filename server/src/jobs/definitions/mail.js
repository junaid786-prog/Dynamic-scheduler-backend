const { JobHandlers } =  require("../handlers");

 const mailDefinitions = (agenda) => {
   agenda.define(
      "remind-event-attendees",
      {
        priority: "high",
        concurrency: 20,
      },
      JobHandlers.sendReminderToAttendees
    );
};

module.exports = { mailDefinitions }