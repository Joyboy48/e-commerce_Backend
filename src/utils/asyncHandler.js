const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
      // Ensure the requestHandler is executed and wrapped in a Promise
      Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
      // If the Promise rejects, pass the error to the next middleware
    };
  };
  
  export { asyncHandler };