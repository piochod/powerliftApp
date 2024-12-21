import Cookies from "js-cookie";

export const fetchExerciseData = async (id) =>{
    try {
      const token = Cookies.get("accessToken");
      const response = await fetch(`http://localhost:3000/exercise/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const result = await response.json();
        console.log(result);
        return result;
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
};
