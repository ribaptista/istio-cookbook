var os = require("os");
const express = require("express");
const axios = require("axios").default;
const app = express();
const port = process.env.PORT;
const usersUrl = process.env.USERS_URL;
const moviesUrl = process.env.MOVIES_URL;

async function getGreeting() {
  let greeting;
  try {
    const response = await axios.get(`${usersUrl}/profile`);
    greeting = {
      status: "ok",
      message: `Hello, ${response.data.name}!`,
    };
  } catch (e) {
    greeting = {
      status: "err",
    };
  }
  return greeting;
}

async function getRecommendations() {
  let recommendations;
  try {
    const response = await axios.get(`${moviesUrl}/recommended/user/101`);
    recommendations = {
      status: "ok",
      movies: response.data,
    };
  } catch (e) {
    recommendations = {
      status: "err",
    };
  }
  return recommendations;
}

app.get("/main", async (req, res) => {
  const greeting = await getGreeting();
  const recommendations = await getRecommendations();
  res.send([
    {
      greeting,
      recommendations,
    },
  ]);
});

app.get("/healthcheck", (req, res) => {
  res.send({
    status: "ok",
    hostname: os.hostname(),
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
