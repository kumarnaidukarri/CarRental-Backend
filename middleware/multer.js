import multer from "multer";

const uploadMiddleware = multer({ storage: multer.diskStorage() }); // middleware

export default uploadMiddleware;

/* 
File Uploads working: 
  - 'Uploading a file' means 
     Receiving binary data from client -> extract it -> store it somewhere -> save its reference in Database.  
  - when user uploads a file. the browser doesn't send the JSON. it sends Binary data.
  - if user uploads Photo.png, 
    then request contains:
     filename, file type, file size, binary content(actual image data)   
  - this binary data can't be understand handled by 'app.use(express.json())' middleware. because, express middleware only parses understands "Content-Type: application/json" 
  - file upload uses, "Content-Type: multipart/form-data".
  - 'Multipart/form-data' is special 'request format' made to send files, text fields. 
     it splits request into 'multiple parts'.  
     ex:  
        Part 1 -> name = Kumar
        Part 2 -> email = kumar@gmail.com
        Part 3 -> image = (binary file data)]

    'Multer' package in server used to handle this 'multipart data'.      
  *
*/
// Multer
/*
 'Multer' is a Npm package used to handle 'file uploads'.
 it provides middleware to handle file uploads and store in the server.
 3 storage mechanisms:
   1) Local Disk:
       it stores files inside "Upload" folder in our server locally.  
       then, save file reference path in Mongodb.
       if server crashes, file is lost. 
   2) Temporary Buffer Memory:
       file stored in buffer temporary. "req.file.buffer" 
       later, we upload it to cloud.  
   3) Cloud Storage(production):
      we send file to cloud service providers. like 'Cloudinary', 'Amazon S3'.
      they store the file and returns a URL. 
      then, URL is stored in our MongoDB best practise.    
note:
  sanitize the upload file by Limit file size, Validate file type, Protect route with JWT, Sanitize file names.  
  *** Mongodb can't store the files. only, it stores Text data, Numbers, References, File URLs.   

Flow: 
    Client sends multipart request(upload file data)
        ↓
    Express Route    
        ↓
    "Multer" Middleware reads multi-part data
        ↓
    File Stored (Disk / Memory / Cloud)
        ↓
    Database (Store file URL/path/reference)
*/
/*
Usage:
command:  npm install Multer 
middlewares/multer.js file code:
    import multer from "multer";
    const uploadMiddleware = multer({ storage: multer.diskStorage() });
    export default uploadMiddleware;
add this middleware in your Route. before the request handler controller function.
ex: app.get("/user/upload-photo", uploadMiddleware, Request Handler Controller Function)    
*/
