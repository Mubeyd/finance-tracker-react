import { IItem } from '@/db/types';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { useCallback, useState } from 'react';

export function RecordRow({
  item,
  onDeleteFinanceRecord,
  onOpenEditFinanceRecord
}: {
  item: IItem;
  onDeleteFinanceRecord: (id: number) => void;
  onOpenEditFinanceRecord: (id: number) => void;
}) {
  const color = item.type === 'income' ? 'green' : 'red';

  const [open, setOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const onOpenEditFinanceRecordCb = useCallback(() => {
    onOpenEditFinanceRecord(item.id);
  }, [item.id, onOpenEditFinanceRecord]);

  const onDeleteFinanceRecordCb = useCallback(() => {
    onDeleteFinanceRecord(item.id);
    setOpenDeleteDialog(!openDeleteDialog);
  }, [item.id, onDeleteFinanceRecord, openDeleteDialog]);

  return (
    <Box
      sx={{
        width: 400,
        backgroundColor: '#fff',
        '&:hover': {
          backgroundColor: '#fff',
          opacity: [0.9, 0.9, 0.9]
        },
        borderRadius: 4,
        padding: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        border: `1px solid ${color}`
      }}
    >
      <Dialog onClose={setOpenDeleteDialog} open={openDeleteDialog}>
        <DialogTitle> Are you sure to delete this record</DialogTitle>

        <DialogActions>
          <Button autoFocus variant='outlined' color='primary' onClick={() => setOpenDeleteDialog(!openDeleteDialog)}>
            Cancel
          </Button>
          <Button variant='outlined' color='error' onClick={onDeleteFinanceRecordCb}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* old Dialog */}

      <Dialog onClose={setOpen} open={open}>
        <DialogTitle>{item.description}</DialogTitle>
        <DialogTitle>{item.amount}</DialogTitle>
        <DialogTitle>{item.type}</DialogTitle>
        <DialogTitle>{moment(new Date(item.createdAt)).format('DD / MM / yyyy, HH:mm')}</DialogTitle>

        <DialogActions>
          <Button autoFocus onClick={() => setOpen(!open)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(!open)}>Done</Button>
        </DialogActions>
      </Dialog>

      <Box>
        <Typography paragraph>{item.description}</Typography>

        <Typography paragraph>
          {item.amount} {item.currency.symbol}
        </Typography>

        <Typography paragraph>{moment(new Date(item.createdAt)).format('DD / MM / yyyy, HH:mm')}</Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
      >
        <Typography
          paragraph
          sx={{
            padding: 0,
            margin: 0
          }}
          color={color}
        >
          {item.type}
        </Typography>

        <BorderColorOutlinedIcon onClick={onOpenEditFinanceRecordCb} color='primary' />

        <DeleteForeverOutlinedIcon onClick={() => setOpenDeleteDialog(!openDeleteDialog)} color='action' />
      </Box>
    </Box>
  );
}
