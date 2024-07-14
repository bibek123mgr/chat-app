const handleGlobalError = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    res.status(statusCode).json({
        message: message,
    });
};

module.exports=handleGlobalError