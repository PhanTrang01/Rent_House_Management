import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface DialogErrorProps {
  message: string;
  openDialog: boolean;
  handleCloseDialog: () => void;
  //   selectedRecord: number | null;
  //   handleDelete: (id: number) => void;
}

const DeleteRecipientDialog: React.FC<DialogErrorProps> = ({
  message,
  openDialog,
  handleCloseDialog,
}) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        <ErrorOutlineIcon color="error" />
        {"LỖI"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteRecipientDialog;
