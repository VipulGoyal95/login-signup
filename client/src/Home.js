import Cookies from "js-cookie";

const Home = () => {
  console.log(Cookies.get("jwtoken"));
};

export default Home;
