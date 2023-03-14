import { Configuration, OpenAIApi } from "openai";
import express from "express";
import * as dotenv from 'dotenv'
import bodyParser from 'body-parser'

dotenv.config()
const app = express();
const port = 3000;

// create application/json parser
var jsonParser = bodyParser.json()

app.use(jsonParser)
// create application/x-www-form-urlencoded parser

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.listen(port, () => {
    console.log('Server is running on port 3000');
});

app.get('/getQuestion', jsonParser, (req, res) => {
  res.status(200).json({ question: req.body });
});

app.get('/idea', jsonParser, (req,res) => {
  var ideas = req.body.ideas;
  
  if(ideas == undefined){
    ideas = [];
  }
  GetIdeas(req, res, ideas);
});

  async function GetIdeas(req, res, ideas) {
    CheckOpenAiAPI(res);
    try {
      const completion = await openai.createCompletion({
        model: "gpt-3.5-turbo",
        prompt: getIdeaPrompt(ideas),
        temperature: 0.8,
        max_tokens: 100,
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

function CheckOpenAiAPI(res){
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md" + process.env.OPENAI_API_KEY,
      }
    });
    return;
  }
}

function getIdeaPrompt(ideas) {

  var ideaString = ""
  console.log(ideas);
  ideas.forEach(idea => {
    ideaString += idea + " and ";
  });

  ideaString = ideaString.substring(0, ideaString.length - 4);

  return `Give me a random idea about "${ideaString}"`;
}






