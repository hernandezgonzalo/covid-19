import React, { useEffect, useRef, useReducer } from "react";
import {
  makeStyles,
  Paper,
  Grid,
  Box,
  CircularProgress
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import NewsCard from "./NewsCard";
import _ from "lodash";
import { getNews } from "../../../services/news.api";

const useStyles = makeStyles(theme => ({
  newsWrapper: {
    height: "calc(100vh - 80px)",
    overflow: "auto",
    [theme.breakpoints.down("md")]: { display: "none" }
  }
}));

const Loading = () => (
  <Box width={1} display="flex" justifyContent="center" p={1}>
    <CircularProgress />
  </Box>
);

const newsReducer = (state, action) => {
  switch (action.type) {
    case "INCREASE_PAGE":
      return { ...state, page: state.page + 1, isLazy: true };
    case "SET_ARTICLES":
      return {
        ...state,
        articles: [...state.articles, ...action.articles],
        isLazy: false
      };
    default:
      throw new Error();
  }
};

const News = () => {
  const newsRef = useRef();
  const classes = useStyles();
  const [news, newsDispatch] = useReducer(newsReducer, {
    page: 0,
    articles: [],
    isLazy: true
  });

  useEffect(() => {
    const { current } = newsRef;
    if (current) {
      current.onscroll = e => {
        const { scrollHeight, scrollTop, clientHeight } = e.target;
        if (scrollHeight - (scrollTop + clientHeight) < 10 && !news.isLazy)
          newsDispatch({ type: "INCREASE_PAGE" });
      };
    }
  }, [news.isLazy]);

  useEffect(() => {
    let isSubscribed = true;
    getNews(news.page)
      .then(articles => {
        if (isSubscribed) newsDispatch({ type: "SET_ARTICLES", articles });
      })
      .catch(console.error);
    return () => (isSubscribed = false);
  }, [news.page]);

  if (_.isEmpty(news.articles))
    return (
      <Grid item xs={12} md={4} lg={3}>
        <Box m={1} textAlign="center">
          <Skeleton variant="rect" className={classes.newsWrapper} />
        </Box>
      </Grid>
    );

  return (
    <Grid item xs={12} md={4} lg={3}>
      <Box
        m={1}
        component={Paper}
        variant="outlined"
        square
        className={classes.newsWrapper}
        ref={newsRef}
      >
        {news.articles.map((article, i) => (
          <NewsCard key={i} {...article} />
        ))}
        {news.isLazy && <Loading />}
      </Box>
    </Grid>
  );
};

export default News;
