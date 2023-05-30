/* 

import { google } from 'googleapis';


const API_KEY = process.env.VUE_APP_API_KEY;

// Each API may support multiple versions. With this sample, we're getting
// v3 of the blogger API, and using an API key to authenticate.
const blogger = google.calendar({
  version: 'v3',
  auth: API_KEY
});

const params = {
  blogId: '3213900'
};

// get the blog details
blogger.blogs.get(params, (err, res) => {
  if (err) {
    console.error(err);
    throw err;
  }
  console.log(`The blog url is ${res.data.url}`);
}); */