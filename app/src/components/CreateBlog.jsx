'use client';
import dynamic from "next/dynamic";
import { useState } from "react";
import editorStyles from "../styles/editor.module.css"
import axios from "axios";
import requestConfig from "../utils/config";
import Select from 'react-select';
import categories from "../utils/categories";
import { motion } from "framer-motion";

const TextEditor = dynamic(() => import("./Editor"), {
  ssr: false
});

const CreateBlog = () => {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [additionalContent, setAdditionalContent] = useState("")
  const [category, setCategory] = useState(categories[0])
  const [image, setImage] = useState(null)
  const [youtubeUrl, setYoutubeUrl] = useState("")

  const [loading, setLoading] = useState(false)


  const onSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData();
    console.log(image)
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", body);
    formData.append("category", category.value);
    formData.append("eventDate", Date.now());
    try {
      setLoading(true)
      let { data } = await axios.post(process.env.NEXT_PUBLIC_BASE_URL + "event/create",formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      setLoading(false)
      window.location.replace("/admin")
    } catch (err) {
      setLoading(false)
      console.log(err)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        type: "keyframes",
        transition: {
          duration: 1,
          bounce: 1,
          delay: 0.1,
        },
      }}
      className={editorStyles.create_post_container}>
      <div className={editorStyles.form_container}>
        <h2> Create Blog Post</h2>
        <form onSubmit={onSubmit} encType="multipart/form-data">
          <div className={editorStyles.input_field_wrapper}>
            <input type="text" placeholder="insert title" required onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className={editorStyles.input_field_wrapper}>
            <input
              type="file"
              required
              name="image"
              accept="image/png, image/jpg, image/gif, image/jpeg"
              //onChange={convert}
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <h4>Select Category</h4>
          <div className={editorStyles.input_field_wrapper}>
            <Select
              value={category}
              onChange={(e) => setCategory(e)}
              options={categories}
            />
          </div>
          <div className={editorStyles.re}>
            <h4>Write something for your event</h4>
          </div>
          <TextEditor setBody={setBody} /> 
  
          <h4>Duration of event</h4>
          <div className={editorStyles.input_field_wrapper}>
            <input type="date" placeholder="Enter duration time" required />
          </div>
          <h4>No of attendees</h4>
          <div className={editorStyles.input_field_wrapper}>
            <input type="text" placeholder="attendees" required />
          </div>
          <div className={editorStyles.button_wrapper}>
            <button className={editorStyles.submit_btn}>{loading ? "Loading" : "Submit"}</button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default CreateBlog