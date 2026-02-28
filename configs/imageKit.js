import ImageKit from "@imagekit/nodejs";

const imagekitClient = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imagekitClient;

// Imagekit.io
/*
it is a free cloud service provider. it offers store images, optimize images, videos.
we can access them via CDNs.
- Create an account, login account.  
   imagekit credentials: fawarac991@creteanu.com, Fawar@123
   create and get API keys. publickey=public_AIsu5qYRRcMkzlAs854/RvUmbA4=,  privatekey=private_kizQRCaqKG6D3zB5WVOZsQVrgQU=,    URL=https://ik.imagekit.io/yocxxuuqd,   ImagekitId=yocxxuuqd
   install SDKs in your project. To connect your 'Backend Server' to the 'Imagekit Server'.

- Usage:
  Nodejs SDK - https://github.com/imagekit-developer/imagekit-nodejs
  Install command:  npm install @imagekit/nodejs

- Code: 
import ImageKit from "@imagekit/nodejs";

const imagekitClient = new ImageKit({privateKey});
const response = await imagekitClient.files.upload( {file: "yourfile object", fileName:"yourfile name", folder:"optional foldername in imagekit"});
console.log(response);

*/
