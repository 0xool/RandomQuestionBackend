import { Configuration, OpenAIApi } from "openai";
import express from "express";
import * as dotenv from 'dotenv'
import bodyParser from 'body-parser'

dotenv.config()
const app = express();
const port = 3000;

// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.listen(port, () => {
    console.log('Server is running on port 3000');
});

app.get('/getQuestion', (req, res) => {
    createRandomQuestion(req, res);
});

app.post('/answerQuestion', jsonParser, (req,res) => {
  console.log(req.body)
  var answer = req.body.answer;
  var question = req.body.question;
  answerRandomQuestion(req, res, question, answer);
});

async function createRandomQuestion(req, res) {  
    sendRequestToOpenAI(res, req);
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: randomQuestionPrompt(),
        temperature: 0.6,
      });
      res.status(200).json({ question: completion.data.choices[0].text });
    } catch(error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        res.status(error.response.status).json(error.response.data);
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        res.status(500).json({
          error: {
            message: 'An error occurred during your request.',
          }
        });
      }
    }
  }


  async function answerRandomQuestion(req, res, question, answer) {
    sendRequestToOpenAI(res, req);
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: getQuestionAnswerPrompt(answer, question),
        temperature: 0.6,
      });
      
      var answer = completion.data.choices[0].text;
      var answerCorrect = false;
      if (answer.includes("truth") || answer.includes("Truth")){
        answerCorrect = true;
        answer = '';
      }else if (answer.includes("false") || answer.includes("False")){
        answerCorrect = false;
        answer = parseOpenAIResponse(answer);
      }
    
      res.status(200).json({ answerResult: answerCorrect, correctAnswer: answer });
    } catch(error) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        res.status(error.response.status).json(error.response.data);
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        res.status(500).json({
          error: {
            message: 'An error occurred during your request.',
          }
        });
      }
    }
  }

function parseOpenAIResponse(input) {
    var response = input;
    response = response.replace("false", "");
    response = response.replace("False", "");
    response = response.replace("\n", "");

    response = response.replace("\n", "");
    response = response.replace(" ", "");
    response = response.replace(".", "");

    console.log(response)
    return response;
}


function sendRequestToOpenAI(res, req){
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md" + process.env.OPENAI_API_KEY,
      }
    });
    return;
  }
}
  
function randomQuestionPrompt() {
    return `Give me a radonm factual question`;
}

function getQuestionAnswerPrompt(answer, question) {
  return `is the answer to the question "${question}" "${answer}"? answer with truth or false`;
}






