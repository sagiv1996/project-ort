export default function ({ $axios, }) {
    $axios.onRequest(request => {
      console.log(request);
    })
  }
  