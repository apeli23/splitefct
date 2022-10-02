### Create a split effect using Next.js and splitjs

## Background

A split screen effect is a common feature to show two images or videos at the same time. It's vital in use cases such as photoshop and video editing programs. In this article, we will use javascript to code an image split effect webpage using Nextjs and split.

## Prerequisites

Basic understanding of Javascript and React

## Setting Up the Sample Project

Using your terminal, generate a Next.js by using the create-next-app CLI:

`npx create-next-app spliteffect`

Go to your project directory :

`cd spliteffect`

## Cloudinary Setup

We begin with setting up a free [Cloudinary](https://cloudinary.com/?ap=em) account here. In your account’s dashboard, you will receive environment keys to use in integrating Cloudinary into your project.

Create a file named ‘.env.local’ in your project root directory and paste in the following:

```
".env.local"

CLOUDINARY_NAME=

CLOUDINARY_API_KEY =

CLOUDINARY_API_SECRET=
```

Complete the above with information from your Cloudinary account.

Go to the ‘pages/api’ directory and create a folder called ‘utils’. Inside the folder create a file named ‘cloudinary’. And paste the following code.

```
"pages/api/cloudinary"


require('dotenv').config();
const cloudinary = require('cloudinary');
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
   upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
});

module.exports = { cloudinary };
```

Our last Cloudinary setup phase will involve setting up our project’s backend. Inside the api directory, create a file named upload.js. We’ll use this component to upload the recorded files. The backend will receive files in base64 string format. The files will be uploaded to the user's web profile and the file's Cloudinary link sent back as a response.

```
"pages/api/cloudinary.js"


var cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
});
export const config = {
    api: {
        bodyParser: {
            sizeLimit: "20mb",
        },
    },
};

export default async function handler(req, res) {
    let uploaded_url = ""
    const fileStr = req.body.data;

    if (req.method === "POST") {
        try {
            const uploadedResponse = await cloudinary.uploader.upload_large(
                fileStr,
                {
                    resource_type: "video",
                    chunk_size: 6000000,
                }
            );
            console.log("uploaded_url", uploadedResponse.secure_url)
            uploaded_url = uploadedResponse.secure_url
        } catch (error) {
            res.status(500).json({ error: "Something wrong" });
        }
        res.status(200).json({ data : uploaded_url });
    }
}
```

With our backend complete, let us create our split screen page.

## Front End

As mentioned before, we will use [split.js](https://www.npmjs.com/package/split.js?utm_source=cdnjs&utm_medium=cdnjs_link&utm_campaign=cdnjs_library) to create the split effect.

We will also use `use-react-screenshot` to create caption our final image for Cloudinary upload.

```
npm install use-react-screenshot split.js
```

Include them in your project imports above the home component.

```
"pages/index.js"


import { forwardRef, useState, createRef, useEffect, useRef } from 'react';
import Split from 'split.js'
import { useScreenshot } from 'use-react-screenshot';

export default function Home(){
    return(
        <div>workspace</div>
    )
}
```

Now inside the return statement, paste the following code. You can locate the respective css code inside the Github repo.

```
"pages/index.js"


  return (
    <div className="container">
      <h2 className="title">Create split effect using Nextjs and Split js</h2>

        <div className="flex" ref={captionRef}>
          <div id="default"></div>
          <div id="picture"></div>
      </div>
      <div className="buttons">
          <input
            id="defaultPic"
            type="file"
            onChange={firstpicHandler}
            hidden
          />
          <button
            className="regularButton"
            onClick={() => { document.getElementById("defaultPic").click() }}
          >
            Change First Photo
          </button><br />
          <input
            id="pic"
            type="file"
            onChange={pictureHandler}
            hidden
          />
          <button
            className="regularButton"
            onClick={() => { document.getElementById("pic").click() }}
          >
            Change Second Photo
          </button><br />
          <button className="outlinedButton" onClick={uploadHandler}>Save Caption</button>
        </div>
    </div>
  )
```

Your UI will look like this:

![complete UI](https://res.cloudinary.com/dlt0f5pvq/image/upload/v1664707960/Screenshot_2022-10-02_at_13.49.50_h4vmv8.png 'complete UI')

Your version once the codes have been pasted is probably still not working. That is because the functions mentioned in the UI are not yet defined. Let us create them.

Inside the Home function paste the following code. We create a `useRef` hook variable to reference our final image DOM element include another hook to caption the final image using `use-react-screenshot`. We also create a `useEffect` hook to split the final image into two components.

```
"pages/index.js

export default function Home() {
  const captionRef = createRef();
  const [caption, takeScreenshot] = useScreenshot();

  useEffect(() => {
    var split = Split(["#default", "#picture"], {
      gutterSize: 5,
      sizes: [25, 50]
    })
  }, [])

  return (
    <div className="container">
      <h2 className="title">Create split effect using Nextjs and Split js</h2>

      <div className="flex" ref={captionRef}>
        <div id="default"></div>
        <div id="picture"></div>
      </div>
      <div className="buttons">
        <input
          id="defaultPic"
          type="file"
          onChange={firstpicHandler}
          hidden
        />
        <button
          className="regularButton"
          onClick={() => { document.getElementById("defaultPic").click() }}
        >
          Change First Photo
        </button><br />
        <input
          id="pic"
          type="file"
          onChange={pictureHandler}
          hidden
        />
        <button
          className="regularButton"
          onClick={() => { document.getElementById("pic").click() }}
        >
          Change Second Photo
        </button><br />
        <button className="outlinedButton" onClick={uploadHandler}>Save Caption</button>
      </div>
    </div>
  )
}
```

Below the use effect hook, define the following functions. The functions will allow the user to select an image from local storage and replace default images in the UI with the selected functions.

```
"pages/index.js"

  const firstpicHandler = async (e) => {
    const file = e.target.files?.item(0);
    console.log(file)
    await readFile(file).then((encoded_file) => {
      document.getElementById("default").style.backgroundImage = `url(${encoded_file})`;
    })
  }


  const pictureHandler = async (e) => {
    const file = e.target.files?.item(0);
    await readFile(file).then((encoded_file) => {
      document.getElementById("picture").style.backgroundImage = `url(${encoded_file})`;
    })
  }

  function readFile(file) {
    // console.log("readFile()=>", file);
    return new Promise(function (resolve, reject) {
      let fr = new FileReader();

      fr.onload = function () {
        resolve(fr.result);
      };

      fr.onerror = function () {
        reject(fr);
      };

      fr.readAsDataURL(file);
    });
  }
```

Finally, use the following function to caption the final image and upload it to cloudinary server.

```

  const uploadHandler = async (e) => {
    await takeScreenshot(captionRef.current).then((screenshot) => {
      try {
        fetch('/api/upload', {
          method: 'POST',
          body: JSON.stringify({ data: screenshot }),
          headers: { 'Content-Type': 'application/json' },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data.data)
          })
      } catch (error) {
        console.error(error);
      }
    })
  }
```

The result will be uploaded and a console message shown to signify a successfull upload. This part successfully completes our objective. Ensure to go through the article to enjoy the experience.

Happy coding!
