import multer from "multer";

const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
}); // Multer middleware saves the file in 'Local Server disk' storage.

export default uploadMiddleware;

/* 
File Uploads working: 
  - 'Uploading a file' means 
     Receiving binary data from client -> extract it -> store it somewhere -> save its reference in Database.  
  - when user uploads a file. the browser doesn't send the JSON. it sends Binary data.

  - if user uploads Photo.png, 
    then request contains:
     filename, file type, file size, binary content(actual image data)   
  - this binary data can't be understand handled by 'app.use(express.json())' middleware. because, express middleware only parses "Content-Type: application/json" 

  - file upload uses, "Content-Type: multipart/form-data".
  - 'Multipart/form-data' is a special 'http request format' made to send files and text fields. 
     it splits request into 'multiple parts'.  
     ex:  
        Part 1 -> name  = Kumar
        Part 2 -> email = kumar@gmail.com
        Part 3 -> image = (binary file data)]

   * 'Multer' package in server used to handle this 'multipart data'. ***  
      Multer middleware intercepts the request 
      -> parses multi-part data -> Extracts text fields -> Extract file & Store in localdisk -> adds File Info to "req.file"
      -> then, automatically calls next().          
  *
*/

// Multer
/*
 'Multer' is a Npm package used to handle 'file uploads'.
 it provides middleware function to handle file uploads and store in the server.
 2 storage mechanisms:
   1) Local Server Disk:
       it stores files inside a "Upload" folder in our "Server Disk" locally.  
       then, save the file reference path in database.
       if server crashes, file is lost. 
       ex: multer.diskStorage();
           req.file.path; // access file
   2) Temporary Buffer Memory(RAM) + Cloud Storage(production):
       file stored in RAM buffer memory temporary.
       then, we upload it to 'cloud service provider' like Image kit, Aws S3.  
       ex: multer.memoryStorage(); // stores file in Ram
           req.file.buffer;      // access to file 
      we send file to cloud service providers using SDKs. like 'Cloudinary', 'Amazon S3'.
      they store the file and returns a URL. 
      then, URL reference is stored in our MongoDB best practice.    
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
    File Stored (LocalDisk / RamMemory&Cloud )
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
