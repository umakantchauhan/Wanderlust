module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); //it returning the same function with same parameter but if the error occurs then .catch(next) will handle that error and call the next function
  };
};
