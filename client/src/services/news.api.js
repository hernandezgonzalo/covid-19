import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_NEWS_API_URL
});

export const getNews = async page => {
  try {
    const { data } = await api.get("/articlesearch.json", {
      params: {
        "api-key": process.env.REACT_APP_NEWS_API_KEY,
        q: '("coronavirus" "covid")',
        fq:
          'source:("The New York Times") AND headline:("coronavirus" "covid")',
        sort: "newest",
        page
      }
    });
    return data.response.docs;
  } catch (error) {
    throw error;
  }
};
