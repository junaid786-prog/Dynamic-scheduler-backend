const { mailDefinitions } =  require("./mail");
const definitions = [mailDefinitions];

 const allDefinitions = (agenda) => {
  definitions.forEach((definition) => definition(agenda));
};

module.exports = { allDefinitions }