module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    if (typeof (err) === 'string') {
        return res.status(400).json({ message: err });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(400).json({ message: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ message: 'Invalid Token' });
    }

    if (err.name === 'UserPostMismatchError') {
        return res.status(401).json({ message: 'Post does not belong to User' });
    }

    if (err.name === 'UserNotFoundError') {
        return res.status(404).json({ message: 'User Not Found' });
    }

    if (err.name === 'PostNotFoundError') {
        return res.status(404).json({ message: 'Post Not Found' });
    }
    
    // default to 500 server error
    return res.status(500).json({ message: err.message });
}