import React, { useEffect, useState, useLayoutEffect, useRef } from "react";
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
    overflow: "scroll",
    [theme.breakpoints.down("md")]: { display: "none" }
  }
}));

const Loading = () => (
  <Box width={1} display="flex" justifyContent="center" p={1}>
    <CircularProgress />
  </Box>
);

const News = () => {
  const classes = useStyles();
  const [articles, setArticles] = useState([]);
  const [newsN, setNewsN] = useState(5);
  const newsRef = useRef();
  const [isLazy, setIsLazy] = useState(false);

  useLayoutEffect(() => {
    const { current } = newsRef;
    if (current) {
      current.onscroll = e => {
        const { scrollHeight, scrollTop, clientHeight } = e.target;
        if (scrollHeight - (scrollTop + clientHeight) === 0 && !isLazy) {
          setIsLazy(true);
          setNewsN(n => n + 5);
        }
      };
    }
  }, [articles, isLazy]);

  useEffect(() => {
    getNews(newsN).then(response => {
      setArticles(response);
      setIsLazy(false);
    });
  }, [newsN]);

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
