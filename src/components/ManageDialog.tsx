import { ICurrency } from '@/db/types';
import { Button, Dialog, DialogActions, DialogTitle, TextField } from '@mui/material';
import AutocompleteSelect from './AutocompleteSelect';

export default function ManageDialog({
  openDialog,
  setOpenDialog,
  type,
  amount,
  setAmount,
  currency,
  setCurrency,
  description,
  setDescription,
  onManageFinanceRecord
}: {
  openDialog: boolean;
  setOpenDialog: (open: boolean) => void;
  type: string;
  amount: number;
  setAmount: (amount: number) => void;
  currency: ICurrency | undefined;
  setCurrency: (currency: ICurrency | undefined) => void;
  description: string;
  setDescription: (description: string) => void;
  onManageFinanceRecord: () => void;
}) {
  return (
    <Dialog
      onClose={setOpenDialog}
      open={openDialog}
      sx={{
        '& .MuiDialog-paper': {
          width: '80%',
          padding: 4
        }
      }}
    >
      <DialogTitle>Type: {type}</DialogTitle>
      <DialogTitle>Amount</DialogTitle>
      <TextField
        id='outlined-number'
        // label='Number'
        type='number'
        InputLabelProps={{
          shrink: true
        }}
        value={amount}
        onChange={e => setAmount(Number(e.target.value))}
      />

      <DialogTitle>Currency</DialogTitle>

      <AutocompleteSelect currency={currency} setCurrency={setCurrency} />

      <DialogTitle>Description</DialogTitle>
      <TextField
        id='outlined-number'
        // label='Description'
        type='text'
        InputLabelProps={{
          shrink: true
        }}
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <DialogActions>
        <Button autoFocus onClick={() => setOpenDialog(!openDialog)}>
          Cancel
        </Button>
        <Button onClick={onManageFinanceRecord}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}
