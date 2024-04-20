exports.isTutor = (req, res, next) => {
    if (req.user.role !== 'tutor') {
        return res.status(403).json({ message: "Access denied. Only tutors can perform this action." });
    }
    next();
};
