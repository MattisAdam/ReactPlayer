import { Button} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import DetailsCase from "../component/detailsCase";
import { useSelector } from "react-redux";
import { RootState } from "../component/store";
import PlayerList from "../component/playerList";


const PlayersPage = () => {

  const playerId = useSelector((state : RootState) => state.player.id)
  const navigate = useNavigate();

  const handleClickCompteur = () =>{ navigate("player/compteur/");}

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '20px' }}>
      <PlayerList maxAge={0} />
    
      <DetailsCase playerId={Number(playerId)} />
    
      <Button
        variant="contained"
        color="info"
        onClick={handleClickCompteur}
        style={{
          width: '200px',
          fontSize: '18px',
          padding: '10px',
          textTransform: 'none',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        Compteur
      </Button>
    </div>
    
    )
}



export default PlayersPage;