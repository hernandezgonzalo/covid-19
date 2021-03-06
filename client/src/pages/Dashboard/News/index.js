import React, { useEffect, useRef, useReducer } from "react";
import {
  makeStyles,
  Paper,
  Grid,
  Box,
  CircularProgress
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import _ from "lodash";
import NewsCard from "./NewsCard";
import { getNews } from "../../../services/news.api";
import newsReducer from "../../../reducers/newsReducer";

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

const News = () => {
  const newsRef = useRef();
  const classes = useStyles();
  const [news, newsDispatch] = useReducer(newsReducer, {
    page: 0,
    articles: [],
    isLazy: true
  });
  const { page, articles, isLazy } = news;

  useEffect(() => {
    const { current } = newsRef;
    if (current) {
      current.onscroll = e => {
        const { scrollHeight, scrollTop, clientHeight } = e.target;
        if (scrollHeight - (scrollTop + clientHeight) < 10 && !isLazy)
          newsDispatch({ type: "INCREASE_PAGE" });
      };
    }
  }, [isLazy]);

  useEffect(() => {
    let isSubscribed = true;
    getNews(page)
      .then(articles => {
        if (isSubscribed) newsDispatch({ type: "SET_ARTICLES", articles });
      })
      .catch(console.error);
    return () => (isSubscribed = false);
  }, [page]);

  if (_.isEmpty(articles))
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
        {articles.map((article, i) => (
          <NewsCard key={i} {...article} />
        ))}
        {isLazy && <Loading />}
      </Box>
    </Grid>
  );
};

export default News;
