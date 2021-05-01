module.exports = {
  isValid: (data, dataType, allowNull = false) => {
    //   console.log("data", data);
    if (!allowNull && (data === undefined || data === "")) {
      return false;
    } else {
      switch (dataType) {
        case "varchar":
          if (typeof data === "string") {
            return true;
          }
          break;
        case "number":
          if (!isNaN(data)) {
            return true;
          }
          break;
        case "list":
          if (Array.isArray(data) === true) {
            return true;
          }
          break;
        default:
          return true;
      }
    }

    return false;
  },
  zeroPadding: (paddingAmount, data) => {
    return ("0000000000" + data).substr(-paddingAmount);
  },
  empty: () => {},
  getNowDate: () => {
    const timestamp = new Date();
    const year = timestamp.getFullYear();
    const month = module.exports.zeroPadding(2, timestamp.getMonth() + 1);
    const day = module.exports.zeroPadding(2, timestamp.getDate());

    return `${year}-${month}-${day}`;
  },
  getDateTime: () => {
    const timestamp = new Date();
    const year = timestamp.getFullYear();
    const month = module.exports.zeroPadding(2, timestamp.getMonth() + 1);
    const day = module.exports.zeroPadding(2, timestamp.getDate());

    const hour = module.exports.zeroPadding(2, timestamp.getHours());
    const minute = module.exports.zeroPadding(2, timestamp.getMinutes());
    const seccond = module.exports.zeroPadding(2, timestamp.getSeconds());

    return `${year}-${month}-${day} ${hour}:${minute}:${seccond}`;
  },
};
