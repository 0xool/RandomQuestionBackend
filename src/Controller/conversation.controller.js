import * as conversation from '../services/conversation.services.js';

export async function getConversation(req, res, next) {
  try {
      res.json(await conversation.getConversation(req.body));
  } catch (err) {
      console.error(`Error while getting programming languages`, err.message);
      next(err);
  }
}

export async function create(req, res) {
  var conversation = req.body.conversation;
  talkToUser(req, res, conversation);
}

export async function update(req, res, next) {
  try {
    res.json(await conversation.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating programming language`, err.message);
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    res.json(await conversation.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting programming language`, err.message);
    next(err);
  }
}


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






