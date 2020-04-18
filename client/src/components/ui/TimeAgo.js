import React from "react";
import JavascriptTimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import en from "javascript-time-ago/locale/en";
import { canonical } from "javascript-time-ago/gradation";
JavascriptTimeAgo.locale(en);

const TimeAgo = ({ date }) => {
  return <ReactTimeAgo date={date} timeStyle={{ gradation: canonical }} />;
};

export default TimeAgo;
