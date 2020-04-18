import React, { useState, useContext } from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { useStyles } from "./styles";
import { withProtected } from "../../../lib/auth/withProtected";
import {
  Container,
  FormControlLabel,
  RadioGroup,
  CircularProgress
} from "@material-ui/core";
import AlertBox from "../../../components/ui/AlertBox";
import Radio from "@material-ui/core/Radio";
import { useHistory } from "react-router-dom";
import WarningIcon from "@material-ui/icons/Warning";
import { addCase } from "../../../services/appService";
import { NotifierContext } from "../../../contexts/NotifierContext";

const questions = [
  {
    title: "Shortness of breath",
    text:
      "Do you have a sudden onset of shortness of breath (in the absence of any other pathology that justifies this symptom)?",
    score: ["60", "0"]
  },
  {
    title: "Fever",
    text: "Do you have a fever? (+37.7ºC)",
    score: ["15", "0"]
  },
  {
    title: "Cough",
    text: "Do you have a persistent dry cough?",
    score: ["15", "0"]
  },
  {
    title: "Contact with any positive",
    text: "Have you had close contact with any confirmed positive patient?",
    score: ["29", "0"]
  },
  {
    title: "Mucus",
    text: "Do you have mucus in your nose?",
    score: ["-0", "0"]
  },
  {
    title: "Muscle pain",
    text: "Do you have muscle pain?",
    score: ["-0", "0"]
  },
  {
    title: "Gastrointestinal symptoms",
    text: "Do you have gastrointestinal symptoms?",
    score: ["-0", "0"]
  },
  {
    title: "Time with symptoms",
    text: "Have you been more than 20 days with these symptoms?",
    score: ["-15", "0"]
  }
];

const Disclaimer = () => (
  <AlertBox>
    The information obtained through the use of this application does not
    replace or intend to replace, in any case, the advice of a medical
    professional. If you think you have symptoms compatible with COVID-19,
    contact the telephone number corresponding to your community.
  </AlertBox>
);

const Test = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [values, setValues] = useState(questions.map(q => q.score[1]));
  const history = useHistory();
  const [isUploading, setIsUploading] = useState(false);
  const { setFlash } = useContext(NotifierContext);

  const handleChange = (event, question) => {
    const newValues = [...values];
    newValues[question] = event.target.value;
    setValues(newValues);
  };

  const handleNext = () => setActiveStep(prevActiveStep => prevActiveStep + 1);

  const handleBack = () => setActiveStep(prevActiveStep => prevActiveStep - 1);

  const handleReset = () => setActiveStep(0);

  const handlePositive = () => {
    setIsUploading(true);
    addCase()
      .then(c => history.push("/app", { caseToShow: c.case }))
      .catch(error => {
        setIsUploading(false);
        setFlash({
          type: "error",
          message: error.message
        });
      });
  };

  const NextStep = () => (
    <div className={classes.actionsContainer}>
      <div>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          className={classes.button}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          className={classes.button}
        >
          {activeStep === questions.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );

  const totalScore = values.reduce((n1, n2) => Number(n1) + Number(n2), 0);

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Take this test to see if you could have COVID-19
      </Typography>
      <Disclaimer />

      <Stepper activeStep={activeStep} orientation="vertical">
        {questions.map((question, i) => (
          <Step key={i}>
            <StepLabel>{question.title}</StepLabel>
            <StepContent>
              <Typography>{question.text}</Typography>
              <RadioGroup
                row
                value={values[i]}
                onChange={e => handleChange(e, i)}
              >
                <FormControlLabel
                  value={question.score[0]}
                  control={<Radio color="primary" />}
                  label="Yes"
                />
                <FormControlLabel
                  value={question.score[1]}
                  control={<Radio color="primary" />}
                  label="No"
                />
              </RadioGroup>
              <NextStep />
            </StepContent>
          </Step>
        ))}
      </Stepper>

      {activeStep === questions.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          {totalScore >= 30 ? (
            <>
              <Typography>It looks like you could have COVID-19</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handlePositive}
                className={classes.button}
                startIcon={
                  isUploading ? <CircularProgress size={24} /> : <WarningIcon />
                }
                disabled={isUploading}
              >
                Notify positive
              </Button>
            </>
          ) : (
            <>
              <Typography>It doesn't seem like you have COVID-19</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => history.push("/app")}
                className={classes.button}
              >
                Finish test
              </Button>
            </>
          )}
          <Button
            variant="contained"
            onClick={handleReset}
            className={classes.button}
          >
            Reset test
          </Button>
        </Paper>
      )}
    </Container>
  );
};

export default withProtected(Test, "user");
