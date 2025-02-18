import Cookies from "js-cookie";

export const fetchExerciseData = async (id) => {
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
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchUserInfo = async () => {
  const token = Cookies.get('accessToken');
  try {
    const response = await fetch('http://localhost:3000/userInfo', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    if (response.ok) {
      const userData = await response.json();
      Cookies.set('userId', userData.user.id);
      return userData;
    }
  }
  catch (error) {
    console.log('Error fetching user info:', error)
    throw error
  }
};
