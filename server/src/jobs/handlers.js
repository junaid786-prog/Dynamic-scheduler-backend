const { sendMail } = require("../utility/mailVerification");

const JobHandlers = {
 sendReminderToAttendees: async (job, done) => {
      const { data } = job.attrs;
      await sendMail(data.to, data.content);
      done();
    },
};

module.exports = { JobHandlers }