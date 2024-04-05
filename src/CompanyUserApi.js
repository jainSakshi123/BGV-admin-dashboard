import Cookies from 'js-cookie'
const getToken = () => {
  if (typeof window !== "undefined") {
  return Cookies.get('token') || null; 
  }else{
    return false
  }
};
const getRefreshToken = () => {
  if (typeof window !== "undefined") {
  return Cookies.get('refreshToken') || null; 
  }else{
    return false
  }
};
const CompanyUserApi = async (url, method, data = {}, isFormData = false) => {
  const token = getToken();
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  });
  const config = {
    method: method,
    headers: headers,
  };
  if (method !== "GET" && method !== "HEAD" && method !== "DELETE") {
    config.body = isFormData ? data : JSON.stringify(data);
  }
  try {
    const response = await fetch(url, config);
  
    if (response.status === 401) {
      const refreshToken = getRefreshToken();
      try {
        const refreshResponse = await fetch(
          "https://employee-tracker-backend.revolutionext.com/companyUser/refresh-token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          }
        );
    
        if (!refreshResponse.ok) {
          throw new Error("Failed to refresh token");
        }
    
        const data = await refreshResponse.json();
        Cookies.set('token', data.token)
      } catch (refreshError) {
        console.error(refreshError);
        window.location.href = "/admin/sign-in";
        return;
      }
    }
    const jsonData = await response.json();
    if (!response.ok) {
      throw new Error(jsonData.message || "API call failed");
    }
    return jsonData;
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export default CompanyUserApi;


