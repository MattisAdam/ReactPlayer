import React, { useState, useEffect } from "react";
import { Adresse, DeletePlayer } from "../HttpRequest/PlayerRequest";
import { Button, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { GetPlayerById } from "../HttpRequest/PlayerRequest";

export interface DeleteProps {
    id: number;
    pseudo: string;
    birthDate: Date;
    adresses: Adresse[]
}

const Delete = (props: DeleteProps) => {
    const [refetch, setRefetch] = useState(false);
    const { data, isLoading } = GetPlayerById(props.id);
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDelete = async () => {
        try {
            await DeletePlayer({ id: props.id, pseudo: props.pseudo, birthDate: props.birthDate, addresses: props.adresses });
            toast.success("Player deleted successfully");
            setOpen(false);
            window.location.reload();

        }

        catch (error) {
            console.error("Erreur lors de la suppression :", error);
            toast.error(" Error during deletion process");
        }
    };
    if (isLoading) return <p>Loading...</p>;
    return (
        <>

            <IconButton onClick={handleClickOpen} sx={{ color: 'red', ml: 1 }}>
                <DeleteIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm Deletion
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <p>Are you sure you want to delete <strong>{data?.pseudo || props.pseudo}</strong>? This action is irreversible.</p>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Back</Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Delete;
