/**
 * @desc  this class is responsible about opreations errors(err that i can predict)
 */
class ApiError extends Error {
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error';
        this.isoperational = true ;
    }
}

module.exports = ApiError;