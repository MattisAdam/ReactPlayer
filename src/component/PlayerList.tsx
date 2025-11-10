import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,IconButton, Button, Menu, MenuItem, Tooltip, Box, Typography} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import { GetPlayerByCriteria, Player } from "../HttpRequest/PlayerRequest";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { setPlayerId } from "./playerSlice";
import Delete from "./delete";



export interface PlayerListProps {
  maxAge: number
}

const PlayerList = (props: PlayerListProps) => {
    let [players, setPlayers] = useState<Player[]>([])
    const navigate = useNavigate();
    useEffect(() => {
      const fetchData = async () => {
        const data = await GetPlayerByCriteria({ filterText: null, isActive: null, maxAge : props.maxAge });
        // console.log("Data", data);
        setPlayers(data);
      };
      fetchData();
    }, [props.maxAge]);
    
    const sortByAgeDesc = () => {
      const sortedPlayers = [...players].sort((a, b) => (b.age ?? 0) - (a.age ?? 0));
      setPlayers(sortedPlayers);
    }

    const sortByAgeAsc = () => {
      const sortedPlayers = [...players].sort((a, b) => (a.age ?? 0) - (b.age ?? 0));
      setPlayers(sortedPlayers);
    }

    const sortByPseudoDesc= () => {
      const sortedPlayers = [...players].sort((a, b) => b.pseudo.localeCompare(a.pseudo));
      setPlayers(sortedPlayers)
    }

    const sortByPseudoAsc= () => {
      const sortedPlayers = [...players].sort((a, b) => a.pseudo.localeCompare(b.pseudo));
      setPlayers(sortedPlayers) 
    }
    
    const [anchorElAge, setAnchorElAge] = useState<null | HTMLElement>(null);
    const openAge = Boolean(anchorElAge);

    const [anchorElPseudo, setAnchorElPseudo] = useState<null | HTMLElement>(null);
    const openPseudo = Boolean(anchorElPseudo);

    const handleClickPseudo = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorElPseudo(event.currentTarget);
    };
    
    const handleClosePseudo = () => {
      setAnchorElPseudo(null);
    };

    const handleClickAge = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorElAge(event.currentTarget);
    };

    const handleCloseAge = () => {
      setAnchorElAge(null);
    };

    const handleClickDispatch =(player: Player) =>{
      dispatch(setPlayerId(player.id))      
    };

    const handleClickAdd = () => {
      navigate("player/add");
    };
    
    const handleClickEdit = (player: Player) => {
      navigate("player/edit/" + player.id);
    };

    const dispatch = useDispatch()
    return (
      <>
      
        <h1 style={{textAlign:"center", fontSize:"80px"}}>
          Player Scrabble
        </h1>
  <TableContainer component={Paper} sx={{ mt: 6, mx: 'auto', width: '95%', boxShadow: 4 }}>
  <Table>
    <TableHead>
      <TableRow sx={{ backgroundColor: '#0e177f' }}>
        <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
          <Tooltip title="Add new player">
            <Button
              onClick={handleClickAdd}
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              sx={{ backgroundColor: '#fff', color: '#333', fontWeight: 'bold', mr: 2 }}
            >
              Add
            </Button>
          </Tooltip>
          Actions
        </TableCell>

        <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
          Username
          <IconButton onClick={handleClickPseudo} sx={{ color: 'white', ml: 1 }}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorElPseudo} open={openPseudo} onClose={handleClosePseudo}>
            <MenuItem onClick={() => { sortByPseudoAsc(); handleClosePseudo(); }}>
              Sort A → Z
            </MenuItem>
            <MenuItem onClick={() => { sortByPseudoDesc(); handleClosePseudo(); }}>
              Sort Z → A
            </MenuItem>
          </Menu>
        </TableCell>

        <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
          Age
          <IconButton onClick={handleClickAge} sx={{ color: 'white', ml: 1 }}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorElAge} open={openAge} onClose={handleCloseAge}>
            <MenuItem onClick={() => { sortByAgeAsc(); handleCloseAge(); }}>
              Sort ↑
            </MenuItem>
            <MenuItem onClick={() => { sortByAgeDesc(); handleCloseAge(); }}>
              Sort ↓
            </MenuItem>
          </Menu>
        </TableCell>

        <TableCell sx={{ color: 'white', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
          Addresses
        </TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {players.map((player, index) => (
        <TableRow key={index} hover sx={{ transition: '0.3s', '&:hover': { backgroundColor: '#f5f5f5' } }}>
          <TableCell>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="View details">
                <IconButton color="primary" size="small" onClick={() => handleClickDispatch(player)}>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit player">
                <IconButton color="secondary" size="small" onClick={() => handleClickEdit(player)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Delete
                id={player.id}
                pseudo={player.pseudo}
                birthDate={player.birthDate}
                adresses={player.addresses}
              />
            </Box>
          </TableCell>

          <TableCell sx={{ fontSize: 14 }}>{player.pseudo}</TableCell>

          <TableCell sx={{ fontSize: 14, textAlign: 'center' }}>{player.age}</TableCell>

          <TableCell>
            {player.addresses && player.addresses.length > 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, textAlign: "center" }}>
                {player.addresses.map((addr) => (
                  <Typography key={addr.id} fontSize={14}>
                    {addr.rue}
                  </Typography>
                ))}
              </Box>
            ) : (
              <Typography fontStyle="italic" color="text.secondary" textAlign={"center"}>
                No address
              </Typography>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer></>
 )
}




export default PlayerList;