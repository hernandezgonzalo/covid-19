import React from "react";
import { makeStyles, Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import TimeAgo from "../../../components/ui/TimeAgo";
import { parseISO } from "date-fns";
import { motion } from "framer-motion";

const useStyles = makeStyles({
  title: { fontSize: "1rem", lineHeight: "1.2rem" },
  snippet: { lineHeight: "1.2rem", marginBottom: ".5em" },
  footer: { fontSize: ".8rem", opacity: ".6" }
});

export default function NewsCard({
  source,
  headline,
  snippet,
  web_url,
  multimedia,
  pub_date
}) {
  const classes = useStyles();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card square>
        <CardActionArea onClick={() => window.open(web_url)}>
          {multimedia[0] && (
            <CardMedia
              component="img"
              alt={headline.main}
              height="140"
              image={`https://www.nytimes.com/${multimedia[0]?.url}`}
            />
          )}
          <CardContent>
            <Typography
              gutterBottom
              variant="h6"
              component="h2"
              className={classes.title}
            >
              {headline.main}
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              component="p"
              className={classes.snippet}
            >
              {snippet}
            </Typography>
            <Grid container justify="space-between">
              <Grid item>
                <Typography color="textSecondary" className={classes.footer}>
                  {source}
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="textSecondary" className={classes.footer}>
                  <TimeAgo date={parseISO(pub_date)} />
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
}
