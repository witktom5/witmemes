# WitMemes

[Live version](https://witmemes.herokuapp.com/)

## Overview

A web application that allows to upload images (called memes in the app) and to display them on a dashboard. After registering an account it is possible to add new memes to the page, comment already existing ones and up- or downvote the memes and their comments.
Because I did not use a frontend framework, it was somewhat challenging to implement some features, like making the voting system not refresh the page and instantly display the updated counters.
The show page for memes feature a Go back button, which was a bit tricky to implement. It redirects precisely to where the user clicked on the meme.

## Technologies

[MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/), [Express](https://expressjs.com/) (with express-session), [Node.js](https://nodejs.org/en/), with [EJS](https://ejs.co/) as a templating engine.

[Cloudinary](https://cloudinary.com/) and [its API](https://github.com/cloudinary/cloudinary_npm) were used to handle image upload and storage. [Multer](https://www.npmjs.com/package/multer) and [multer-storage-cloudinary](https://www.npmjs.com/package/multer-storage-cloudinary) were used to handle multipart/form-data Cloudinary file upload.

This project also uses: [Passport](https://www.passportjs.org/), [connect-flash](https://github.com/jaredhanson/connect-flash), [connect-mongo](connect-mongo), [method-override](https://www.npmjs.com/package/method-override), [moment](https://www.npmjs.com/package/moment) and [express-mongo-sanitize](https://www.npmjs.com/package/express-mongo-sanitize).

## License

The MIT License
