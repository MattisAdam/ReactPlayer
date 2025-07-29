import React, { useEffect } from "react";
import { GetPlayerById } from "../HttpRequest/PlayerRequest";
import { Button, Chip, Typography, Box, CircularProgress } from "@mui/material";
import { castDateAsParam } from "../core/dateHelper";

export interface DetailsCaseProps {
  playerId: number;
}

const DetailsCase = ({ playerId }: DetailsCaseProps) => {

  const { data, isLoading, refetch, isRefetching } = GetPlayerById(playerId);
  const date = data?.birthDate;
  const dateString = date ? castDateAsParam(date).toLocaleDateString('fr-FR') : "";
  useEffect(() => {
    refetch();
  }, [refetch]); 
  
  
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt={6}
      px={2}
    >
      <Typography variant="h4" gutterBottom>
        Détails du joueur
      </Typography>

      {(isLoading || isRefetching) && <CircularProgress />}
      
      {data && (
        <Box mt={2} textAlign="center">
          
          <Typography variant="h6">Pseudo : {data.pseudo}</Typography>
          <Typography variant="h6">Âge : {data.age}</Typography>
          <Typography variant="h6" gutterBottom>
            Adresse{data.addresses.length > 1 ? "s" : ""} :
          </Typography>
          
          {data.addresses && data.addresses.length > 0 ? (
                data.addresses.map((addr) => (
                    <div key={addr.id}>{addr.rue}</div>
                ))
            ) : (
                <em style={{ color: "#888" }}>no data</em>
            )}
          <Typography variant="h6" mt={2}>
            Birthdate : {dateString}
          </Typography>
        </Box>
      )}


    </Box>
  );
};

export default DetailsCase;
