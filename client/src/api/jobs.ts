useEffect(() => {
  axios.get("/courses").then((res) => setCourses(res.data));
}, []);
