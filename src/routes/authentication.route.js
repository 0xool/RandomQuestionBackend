import express from 'express';
import * as authentication from '../Controller/authentication.controller.js';

export const router = express.Router();

router.get('/login', authentication.loginUser);
  
/* POST programming language */
router.post('/signUp', authentication.create);

/* PUT programming language */
// router.put('/:id', programmingLanguagesController.update);

/* DELETE programming language */
// router.delete('/:id', programmingLanguagesController.remove);


