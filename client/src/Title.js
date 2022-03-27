import React from 'react';
import { Typography, Grid } from '@mui/material';
import { lime } from '@mui/material/colors';


const Title = () => (    
  <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
    <Grid item xs={12}>
      <Typography variant='h3' style={{ color: lime['A700'] }}>ETH Escrow</Typography>
      <Typography variant='subtitle1' style={{ color: lime['A100'] }}>An escrow project implemented over ethereum blockchain.</Typography>
    </Grid>

  </Grid>
);


export default Title;