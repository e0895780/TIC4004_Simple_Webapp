const path = require('path');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const expressLayouts = require('express-ejs-layouts');

const authRouter = require('./routes/auth');

const app = express();

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layout');

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));
app.use(expressLayouts);
app.use(
	session({
		secret: 'replace-this-secret',
		resave: false,
		saveUninitialized: false,
		cookie: { httpOnly: true },
	})
);

// Expose session user to views
app.use((req, res, next) => {
	res.locals.currentUser = req.session.user || null;
	next();
});

// Routes
app.get('/', (req, res) => {
	if (req.session.user) return res.redirect('/form');
	res.render('index');
});

app.use('/', authRouter);

// 404
app.use((req, res) => {
	res.status(404).send('Not Found');
});

// Start server
app.listen(app.get('port'), () => {
	console.log(`Server running on http://localhost:${app.get('port')}`);
});


