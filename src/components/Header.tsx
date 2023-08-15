import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export function Header({ totalBalance, currency }: { totalBalance: string; currency: string }) {
  return (
    <AppBar position='fixed' sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <Toolbar
        style={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant='h6' noWrap component='div'>
          Finance Tracker
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          <Typography
            variant='h6'
            noWrap
            component='div'
            style={{
              margin: '0 1rem'
            }}
          >
            Balance:
          </Typography>
          <Typography
            variant='h6'
            noWrap
            component='div'
            style={{
              margin: '0 1rem'
            }}
          >
            {totalBalance} {currency}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
