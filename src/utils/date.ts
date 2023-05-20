/**
 * 
 * @param {String} date - DD-MM-YYYY
 * @returns YYYY-MM-DD
 */
export const convertDateFormat = (date: string) => {
    return new Promise((resolve, reject) => {
  
      if (
        (date && !date.toString().includes("-")) ||
        date.toString().split("-")[0].length != 2 ||
        parseInt(date.toString().split("-")[0]) <= 31 ||
        date.toString().split("-")[1].length != 2 ||
        parseInt(date.toString().split("-")[1]) <= 12 ||
        date.toString().split("-")[2].length != 4
      ) {
        return reject({
          message: "Invalid date format required DD-MM-YYYY",
          statusCode: 400,
        });
      }
      const splittedDate = date.toString().split("-");
      resolve(`${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`);
    });
  };