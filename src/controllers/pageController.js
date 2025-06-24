export const getHomePage = (req, res) => {
    // The 'user' object is attached by the 'addUserToLocals' middleware
    res.render('index', {user: res.locals.user || null});
};

export const getLoginPage = (req, res) => {
    res.render('login', {error: null, user: null});
};

export const getRegisterPage = (req, res) => {
    res.render('register', {error: null, user: null});
};

export const getDashboardPage = (req, res) => {
    // The 'user' object is attached by the 'protect' middleware
    res.render('dashboard', {user: req.user});
};

export const getAdminPage = (req, res) => {
    // The 'user' object is attached by the 'protect' middleware
    res.render('admin', {user: req.user});
};