const ApiResponse = {
   Success: (message, results, statusCode) => {
      return {
         message,
         error: false,
         success: true,
         code: statusCode,
         results
      };
   },
   Error: (message, statusCode) => {
      // List of common HTTP request code
      // const codes = [200, 201, 400, 401, 404, 403, 422, 500];

      // // Get matched code
      // const findCode = codes.find((code) => code == statusCode);

      // if (!findCode) statusCode = 500;
      // else statusCode = findCode;

      return {
         message,
         code: statusCode,
         error: true
      };
   },
   validation: (errors) => {
      return {
         message: "Validation errors",
         error: true,
         code: 422,
         errors
      };
   }
}
export default ApiResponse;