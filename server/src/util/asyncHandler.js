/**
 * src: https://stackoverflow.com/questions/67404243/how-does-this-asynchandler-function-work
 * asyncHandler's name implies, it accepts a fn
 * which is treated as an async handler. fn can return
 * a promise and asyncHandler will properly wrap it and
 * automatically connect the next callback to properly
 * handle errors.
 *
 * This is an effective combinator because it prevents you
 * from having to write this try-catch boilerplate for every
 * async handler you would need
 */

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// usage:
// app.get('/jobs/:id', asyncHandler(getJob))
// It wraps the "getJob" to handle error automatically

export default asyncHandler;
