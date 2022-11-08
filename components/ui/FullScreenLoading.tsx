import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export const FullScreenLoading = () => {
  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      height='calc(100vh - 200px)'
      sx={{ flexDirection: { xs: 'column', sm: 'row' } }}
    >
      <CircularProgress thickness={2} />
      <Typography sx={{ ml: 2 }} variant='h2' fontSize={25}>
        Cargando...
      </Typography>
    </Box>
  );
};
