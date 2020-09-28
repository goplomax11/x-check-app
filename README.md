# X Check App / RS Assessment Tool

[Demo](https://x-check-app-team30.vercel.app/)

## Run on local machine

To get the app running on your local machine in development mode first you need to:

- clone the repository
- install the dependencies.

```
npm i
npm i -g json-server
```

- run in development mode (client and [json-server](https://github.com/typicode/json-server))

```
npm run dev
```

To generate a production build (client only):

```
npm run build
```

After this you will have all your production site code inside the 'build' folder.

## Deploy to a remote server

You can also deploy the application to a remote server like [Netlify](https://www.netlify.com/), [Heroku](https://dashboard.heroku.com/) or [Vercel](https://vercel.com/)
For this you will need to either upload a ready-made build manually or fork the repository, so that you can [connect your netlify site to your github repository](<[Netlify](https://www.netlify.com/blog/2016/07/22/deploy-react-apps-in-less-than-30-seconds/)>).

Or with a few commands in the terminal:
```
npm i -g vercel
// or
yarn global add vercel

vercel login

//Next, go to your project root directory and run the following command.

vercel
```

## Functionality and features

This application was created as a solution to RS School React course task [XCheck](https://github.com/rolling-scopes-school/tasks/blob/master/tasks/xcheck/xcheck.md).

It's functionality corresponds to the listed tasks and has some additional features, not mentionel in the task description:

1. A list of all users, incliding their functional roles in app.
2. Option to filter reviews by their state: Disputed, Published, Accepted etc.
3. Error message box showing, when there is a problem loading any data.

## Automated testing

To run tests, first make sure you have the app running in development mode. To do this:

```
npm run dev
```

then in second terminal window run:

```
npm test -- --coverage
```

This will show you coverage report, that will look something like this:
![test coverage report demo](https://i.imgur.com/5bFhnTS.png 'test coverage report demo')

eslint check
```
npm run lint
```

## Roles

All actions allowed and disallowed for different roles [are described here](https://docs.google.com/spreadsheets/d/1Uke8tvGoI-RN2K_Zv8Ji3oZMaPVTSco1SWWc0Uad92M/edit?usp=sharing).

Now any user can select any number of roles to simplify testing, after being authenticated
