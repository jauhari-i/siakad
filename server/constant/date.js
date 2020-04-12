const moment = require("moment");

const date = {
  dateToday: moment().format("YYYY-MM-DD"),
  dateTimeToday: moment().format("YYYY-MM-DD HH:MM:SS"),
  dateTommorrow: moment().add(1, "d").format("YYYY-MM-DD"),
};

module.exports = date;
