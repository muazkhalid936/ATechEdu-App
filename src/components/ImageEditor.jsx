"use client";
import React, { useState, useEffect, useRef } from "react";
import Konva from "konva";
import { Stage, Layer, Image, Text } from "react-konva";

export default function ImageEditor() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [texts, setTexts] = useState([]);
  const stageRef = useRef(null);
  const imageRef = useRef(null);
  const logoRef = useRef(null);
  const [imageObj, setImageObj] = useState(null);
  const [logoObj, setLogoObj] = useState(null);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
    }
  };

  // Handle logo upload
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Load the image and logo into Konva once uploaded
  useEffect(() => {
    if (uploadedImage) {
      const img = new window.Image();
      img.src = uploadedImage;
      img.onload = () => {
        setImageObj(img);
      };
    }
  }, [uploadedImage]);

  useEffect(() => {
    if (uploadedLogo) {
      const img = new window.Image();
      img.src = uploadedLogo;
      img.onload = () => {
        setLogoObj(img);
      };
    }
  }, [uploadedLogo]);

  // Add new text to the stage
  const addText = () => {
    const newText = {
      text: "New Text",
      fontSize: 20,
      x: 100,
      y: 100,
    };
    setTexts([...texts, newText]);
  };

  // Edit text content
  const editText = (index) => {
    const newText = prompt("Enter new text:", texts[index].text);
    if (newText !== null) {
      setTexts((prevTexts) =>
        prevTexts.map((text, i) =>
          i === index ? { ...text, text: newText } : text
        )
      );
    }
  };

  // Save the canvas as an image
  const saveImage = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement("a");
    link.href = uri;
    link.download = "edited-image.png";
    link.click();
  };

  return (
    <div className="image-editor" style={{ textAlign: "center" }}>
      {/* Image upload */}
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      {/* Add text button */}
      <button onClick={addText}>Add Text</button>

      {/* Logo upload */}
      <input type="file" accept="image/*" onChange={handleLogoUpload} />

      {/* Konva Stage (Canvas) */}
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        style={{
          border: "1px solid #ccc",
          width: "auto",
          height: "auto",
          minHeight: "70vh",
          marginTop: "20px",
        }}
      >
        <Layer>
          {/* Image Layer */}
          {imageObj && (
            <Image
              image={imageObj}
              x={0}
              y={0}
              width={500}
              height={500}
              ref={imageRef}
            />
          )}

          {/* Logo Layer */}
          {logoObj && (
            <Image
              image={logoObj}
              x={20}
              y={20}
              width={150}
              height={150}
              ref={logoRef}
            />
          )}

          {/* Text Layer */}
          {texts.map((text, index) => (
            <Text
              key={index}
              text={text.text}
              fontSize={text.fontSize}
              x={text.x}
              y={text.y}
              fill="white"
              shadowColor="black"
              shadowBlur={5}
              draggable
              onClick={() => editText(index)}
            />
          ))}
        </Layer>
      </Stage>

      {/* Save button */}
      <button
        onClick={saveImage}
        className="text-white px-3 py-2 bg-blue-300 hover:bg-blue-500 duration-300 my-2 ease-in-out"
      >
        Save Image
      </button>
    </div>
  );
}
