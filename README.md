# PGxPO Flood

## Installation

**Node 16 or newer is required!**
```sh-session
npm install pgxpo-flood
yarn add pgxpo-flood
pnpm add pgxpo-flood
bun add pgxpo-flood
```

## Example usage

```js
import PGxFlood from 'pgxpo-flood'

const flood = new PGxFlood({
    times: 3, // tries?
    resetTime: 30, // the expiration time (in seconds) for every try
    waitTime: 60 * 25, // the time (in seconds) that when a key reached a times count (block time you can say)
    ifFail: (req, res, next) => res.sendStatus(429), // for middleware things, u can use the check method without the middleware.
    getKey: req => req.ip // uhh, again.. middlewares?
})

/* if you don't use a express or you have a discord bot you can use it like this.. */
flood.check(message.author.id) // it returns a true/false value
// if the value is true so its okay and the key (message.author.id) doesn't reached the limit
// else the user reached the limit and every check it return false until the "waitTime" ends and it will return work normal after the waitTime with a reset for the key

/* for the middlewares.. */

const middleware = flood.middleware()
app.get("/magic_link", middleware, (req,res) => res.send("meow?"))
// it will check for every request, if the user reach the limit the "ifFail" function.
```

and.. yeah thats it!