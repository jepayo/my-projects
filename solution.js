import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import inquirer from "inquirer";

const app = express();
const port = 3000;

var the_code = "";
var endp = "";

var quiz = [];


let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);

  inquirer.prompt([{
    type: 'input',
    name: 'code',
    message: 'Pss?:'
  },{
    type: 'input',
    name: 'endpo',
    message: 'End?:'
  }])
  .then((answer) => {
    the_code = answer.code;
    endp = answer.endpo;
    console.log("Here I am");
  })
  .then(lets_connect)
  .catch((error) => {
    if (error.isTtyError) {
      console.log("Here I am 2");
    } else {
      console.log("Here I am 3");
    }
  });

});

function lets_connect() {
  var conex = {
    user: "postgres",
    host: endp,
    database: "world",
    password: the_code,
    port: 5432,
  };

  console.log("Working");

  const db = new pg.Client(conex);
  db.connect();


  db.query("SELECT * FROM capitals", (err, res) => {
    if (err) {
      console.error("Error executing query", err.stack);
    } else {
      quiz = res.rows;
    }
    db.end();
  });
}
