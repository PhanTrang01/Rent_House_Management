import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

interface DeleteRecipientDialogProps {
  openDialogDelete: boolean;
  handleCloseDialogDelete: () => void;
  selectedRecord: number | null;
  handleDelete: (id: number) => void;
}

const DeleteRecipientDialog: React.FC<DeleteRecipientDialogProps> = ({
  openDialogDelete,
  handleCloseDialogDelete,
  selectedRecord,
  handleDelete,
}) => {
  if (selectedRecord !== null) {
    return (
      <Dialog
        open={openDialogDelete}
        onClose={handleCloseDialogDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Xóa bản ghi?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn chọn xác nhận để xóa thông tin đã chọn.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogDelete}>Hủy</Button>
          <Button onClick={() => handleDelete(selectedRecord)} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  return null;
};

export default DeleteRecipientDialog;
