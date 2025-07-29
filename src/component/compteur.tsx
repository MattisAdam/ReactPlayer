import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
  LinearProgress,
  LinearProgressProps,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { PostMultiple } from "../HttpRequest/MultipleHistoryRequest";
import { setNumber } from "./counterSlice";
import { RootState } from "./store";

const Compteur = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const counter = useSelector((state: RootState) => state.number.num);

  const [progress, setProgress] = useState(0);
  const [sending, setSending] = useState(false);

  const sendCompteurToDb = async (value: number) => {
    setSending(true);
    setProgress(0);

    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval); 
          return prev;
        }
        return prev + 5; 
      });
    }, 100); 
    try {
      const result = await PostMultiple(value);
      console.log("Successful send", result);
      dispatch(setNumber(value));
      toast.success("Compteur envoyé avec succès !");
      setProgress(100);
    } catch (error) {
      console.error("Error sending compteur:", error);
      toast.error("Erreur lors de l'envoi du compteur");
      setProgress(100);
    } finally {
      setTimeout(() => {
        setSending(false);
        setProgress(0);
      }, 500); 
    }
  };

  useEffect(() => {
    const savedCounter = localStorage.getItem("counter");
    if (savedCounter !== null) {
      dispatch(setNumber(parseInt(savedCounter, 10)));
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("counter", counter.toString());
    if (counter !== 0 && counter % 10 === 0) {
      sendCompteurToDb(counter);
    }
  }, [counter]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Card elevation={4} sx={{ padding: 4, minWidth: 300, width: 400 }}>
        {sending && <LinearProgress variant="determinate" value={progress} />}
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Compteur : {counter}
          </Typography>

          <Stack spacing={2} mt={2}>
            <Button variant="contained" color="primary" disabled={sending} onClick={() => dispatch(setNumber(counter + 1))}>
              Incrémenter
            </Button>
            <Button variant="contained" color="primary" disabled={sending} onClick={() => dispatch(setNumber(Math.max(0, counter - 1)))}>
              Décrémenter
            </Button>
            <Button variant="contained" color="secondary" disabled={sending} onClick={() => dispatch(setNumber(counter + 10))}>
              +10
            </Button>
            <Button variant="contained" color="secondary" disabled={sending} onClick={() => dispatch(setNumber(counter + 5))}>
              +5
            </Button>
            <Button variant="outlined" color="inherit" onClick={() => navigate("../")} disabled={sending}>
              Retour
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Compteur;
