import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_NEWS_API_URL
});

export const getNews = async (newsN = 5) => {
  const response = await api.get("/everything", {
    params: {
      apiKey: process.env.REACT_APP_NEWS_API_KEY,
      qInTitle: "coronavirus OR covid",
      sortBy: "publishedAt",
      language: "en",
      domains:
        "bbc.co.uk, engadget.com, theguardian.com, cnn.com, nbcnews.com, apnews.com, cbsnews.com",
      pageSize: newsN
    }
  });

  return response.data.articles;
};
