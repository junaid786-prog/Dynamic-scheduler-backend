const { sendMail } = require("../utility/mailVerification");

const JobHandlers = {
 sendReminderToAttendees: async (job, done) => {
      const { data } = job.attrs;
      console.log(data)
      await sendMail(data.to, data.content);
      done();
    },
};

module.exports = { JobHandlers }