import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import filesystem from 'fs';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file
  app.get('/filteredimage', async ( req: Request, res: Response ) => {
    const image_url = req.query.image_url;

    if (!image_url) {
      return res.status(422).send({ message: 'image_url is required' });
    }

    const image_path: string = await filterImageFromURL(image_url);

    if (!image_path) {
      return res.status(500).send({ message: 'something went wrong while processing the image: '})
    }

    res.sendFile(image_path, err => {
      if (err) {
        res.sendStatus(500);
      }
      filesystem.unlinkSync(image_path)
    });
  });

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
