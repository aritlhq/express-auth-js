export const getMe = (req, res) => {
    if (req.user) {
        res.status(200).json(req.user);
    } else {
        res.status(401).json({message: 'Not authenticated'});
    }
};