const express = require("express");
const { generateToken, validateAdminToken } = require("./utils");
const app = express();
const port = 3001;

app.use(express.json());

const USERS = [];
let userIdCounter = 0;

const QUESTIONS = [
  {
    id: 1,
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

let problemIdCounter = 1;

const SUBMISSIONS = [];
let submissionIdCounter = 0;

app.post("/signup", function (req, res) {
  const { email, password } = req.body;
  const userExists = USERS.some((user) => user.email === email);
  if (userExists) {
    res.status(409).send("User with this email already exists.");
  } else {
    const user = { id: ++userIdCounter, email, password };
    USERS.push(user);
    res.status(200).json(user);
  }
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;
  const user = USERS.find((user) => user.email === email);
  if (user && user.password === password) {
    const token = generateToken();
    res.status(200).json({ token });
  } else {
    res.sendStatus(401);
  }
});

app.get("/questions", function (_, res) {
  res.json(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  const userId = parseInt(req.query.userId);
  const problemId = parseInt(req.query.problemId);

  const userSubmissions = SUBMISSIONS.filter(
    (submission) =>
      submission.userId === userId && submission.problemId === problemId
  );

  res.json(userSubmissions);
});

app.post("/submissions", function (req, res) {
  const { userId, problemId, solution } = req.body;

  const user = USERS.find((user) => user.id === parseInt(userId));
  if (!user) {
    res.status(404).send("User not found.");
    return;
  }

  // Check if the question exists
  const question = QUESTIONS.find(
    (question) => question.id === parseInt(problemId)
  );
  if (!question) {
    res.status(404).send("Question not found.");
    return;
  }

  const isAccepted = Math.random() < 0.5;

  const submission = {
    id: ++submissionIdCounter,
    userId: parseInt(userId),
    problemId: parseInt(problemId),
    solution,
    isAccepted,
  };

  SUBMISSIONS.push(submission);

  res.status(200).json(submission);
});

app.post("/problems", function (req, res) {
  const { token, problem } = req.body;

  const isAdmin = validateAdminToken(token);

  if (!isAdmin) {
    res.sendStatus(403);
  } else {
    if (!problem.title || !problem.description || !problem.testCases) {
      res.status(400).send("Required fields are missing.");
      return;
    }

    const newProblem = {
      id: ++problemIdCounter,
      ...problem,
    };

    QUESTIONS.push(newProblem);
    res.status(200).json(newProblem);
  }
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
