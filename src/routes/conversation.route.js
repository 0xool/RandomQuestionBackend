import express from "express";
import * as conversation from '../Controller/conversation.controller.js';


// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
export const conversationRoutes = express.Router();

// This will help us connect to the database

// This section will help you get a list of all the records.
conversationRoutes.route("/getConversation", conversation.getConversation);

// This section will help you create a new record.
conversationRoutes.route("/setConversation", conversation.create);

// This section will help you update a record by id.
conversationRoutes.route("/updateConversation", conversation.update);

// This section will help you delete a record
conversationRoutes.route("/deleteConversation", conversation.remove);

