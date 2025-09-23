const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

function ensureGuest(req, res, next) {
	if (req.session.user) return res.redirect('/');
	next();
}

function ensureAuth(req, res, next) {
	if (!req.session.user) return res.redirect('/login');
	next();
}

router.get('/signup', ensureGuest, (req, res) => {
	res.render('signup');
});

router.post('/signup', ensureGuest, (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).render('signup', { error: 'Email and password required' });
	const passwordHash = bcrypt.hashSync(password, 10);
	db.run(
		'INSERT INTO users (email, password_hash) VALUES (?, ?)',
		[email, passwordHash],
		function (err) {
			if (err) {
				const message = err.code === 'SQLITE_CONSTRAINT' ? 'Email already registered' : 'Something went wrong';
				return res.status(400).render('signup', { error: message });
			}
			req.session.user = { id: this.lastID, email };
			res.redirect('/form?signup=1');
		}
	);
});

router.get('/login', ensureGuest, (req, res) => {
	res.render('login');
});

router.post('/login', ensureGuest, (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) return res.status(400).render('login', { error: 'Email and password required' });
	db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
		if (err) return res.status(500).render('login', { error: 'Something went wrong' });
		if (!user) return res.status(400).render('login', { error: 'Invalid credentials' });
		const ok = bcrypt.compareSync(password, user.password_hash);
		if (!ok) return res.status(400).render('login', { error: 'Invalid credentials' });
		req.session.user = { id: user.id, email: user.email };
		res.redirect('/form');
	});
});

router.post('/logout', ensureAuth, (req, res) => {
	req.session.destroy(() => {
		res.clearCookie('connect.sid');
		res.redirect('/login');
	});
});

// New add in for Form submission page (protected)
router.get('/form', ensureAuth, (req, res) => {
    res.render('form');
});

// New add in for Handle form submission and persist to DB
router.post('/form', ensureAuth, (req, res) => {
    const { name, email, phone, country, gender, qualification } = req.body;
    if (!name || !email || !phone || !country || !gender || !qualification) {
        return res.status(400).render('form', { error: 'All fields are required' });
    }
    db.run(
        'INSERT INTO submissions (name, email, phone, country, gender, qualification, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, email, phone, country, gender, qualification, req.session.user.id],
        function (err) {
            if (err) {
                return res.status(500).render('form', { error: 'Could not save submission' });
            }
            res.redirect('/thank-you');
        }
    );
});

// New add in forThank you page after successful form submission
router.get('/thank-you', ensureAuth, (req, res) => {
    res.render('thankyou');
});

module.exports = router;



