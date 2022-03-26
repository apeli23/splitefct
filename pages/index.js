
import { forwardRef, useState, createRef, useEffect, useRef } from 'react';
import Split from 'split.js'
import { useScreenshot } from 'use-react-screenshot';


export default function Home() {
  const captionRef = createRef();
  const [caption, takeScreenshot] = useScreenshot();

  const defaultPictureHandler = async (e) => {
    const file = e.target.files?.item(0);
    console.log(file)
    await readFile(file).then((encoded_file) => {
      document.getElementById("default").style.backgroundImage = `url(${encoded_file})`;
      document.getElementById("picture").style.backgroundImage = `url(${encoded_file})`;
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
            onChange={defaultPictureHandler}
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