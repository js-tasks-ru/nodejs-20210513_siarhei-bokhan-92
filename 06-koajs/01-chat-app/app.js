const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const callbacks = {};
let counter = 0;

router.get('/subscribe', async (ctx, next) => {
	const id = counter++;

	ctx.res.once("close", () => {
		if (callbacks[id]) callbacks[id](null);
	})

	await new Promise(resolve => {
		callbacks[id] = resolve;
	}).then(message => {
		ctx.body = message;
		delete callbacks[id];
	});
});

router.post('/publish', async (ctx, next) => {
	const message = ctx.request.body.message;
	if (message) Object.values(callbacks).forEach(callback => callback(message));

	ctx.body = null;
});

app.use(router.routes());

module.exports = app;
