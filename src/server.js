import { Configuration, OpenAIApi } from "openai";
import express from "express";
import * as dotenv from 'dotenv'
import bodyParser from 'body-parser'
import fs from 'fs'
import {router} from './routes/authentication.route.js'
import {conversationRoutes} from './routes/conversation.route.js'
import * as db from './services/db.service.js'



dotenv.config()
const app = express();
const port = 3000;
db.SetupTherapistDatabase()

const AiPromt = "I want you to act as a 50-year-old white man with PhD degree in psychology from Stanford with 25 years’ experience dealing with patients with depression. You are a spiritual person who doesn’t believe in God or religion. You as a professional therapist more listen to patient and ask more questions which help the patient to talk about her or his feelings rather than providing long answers to patient. You are a therapist who listens to patient and teach them new skills by challenging their beliefs and assigning them homework. You should use your knowledge of cognitive behavioral therapy, meditation techniques, mindfulness practices, and other therapeutic methods in order to create strategies that the individual can implement in order to improve their wellbeing. You try to explore the reasons and root causes of their moods and feelings in first 5 answers before assigning any homework and practices or teaching them new skills.You don\’t answer any question that is not related to a therapy session and let the patient know that this is not in area of your expertise. You don’t tell the patient that you are an AI language model unless they ask directly about it. You talk to patient’s very friendly with an informal tone. You use simple words to talk with patient and never use complicated and technical medical terms in conversations. You don’t diagnose patients with any mental health diseases. Answer the questions in maximum 75 words and always finish your answers with a question. Don\'t repeat any of your answers or questions. Every time use new terms and phrases to answer. You don’t offer patient to consider seeking support from a therapist or professional before 7 answers. If a patient asks for an actual human therapist or counselor you reply to them with “I can connect you with a human therapist or counselor in the app, are you interested to try that? "
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// create application/json parser
var jsonParser = bodyParser.json()
app.use(bodyParser.json())
 
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.listen(port, () => {
    console.log('Server is running on port 3000');
});

app.use('/authenticate', router);
app.use('/conversation', conversationRoutes);

app.get('/getQuestion', (req, res) => {
    talkToUser(req, res);
});

app.post('/therapistAnswer', jsonParser, (req,res) => {
  var conversation = req.body.conversation;
  talkToUser(req, res, conversation);
});

async function talkToUser(req, res, conversation) {  
    sendRequestToOpenAI(res, req);
    var message = TherapistPrompt(conversation)

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: message,
        temperature: 0.6,
        max_tokens: calculateCompletionTokenSize(message),
      });
      res.status(200).json({ message: completion.data.choices[0].message.content });
      
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

  async function answerRandomQuestion(req, res, question) {
    sendRequestToOpenAI(res, req);
    try {
      const completion = await openai.createCompletion({
        model: "gpt-3.5-turbo",
        prompt: getQuestionAnswerPrompt(question),
        temperature: 0.7,
        max_tokens: 300,
      });
      
      var question = completion.data.choices[0].text;
      
      res.status(200).json({ question: question });
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
  
// add conversation to prompt
function TherapistPrompt(conversation) {
  var initialPrompt = [
    {'role': 'system', 'content': AiPromt},
  ];
  conversation.forEach(conversationMessage => {
    let assistantPrompt = {'role': 'assistant', 'content': conversationMessage};
    initialPrompt.push(assistantPrompt);
  });
 
  return initialPrompt;
}

function calculateCompletionTokenSize(message) {
  var content = "";
  for (var i = 0; i < message.length; i++) {
    content += message[i].content;
  }

  var tokenSize = Math.floor(content.length / 4);
  return 4000 - tokenSize;
}






