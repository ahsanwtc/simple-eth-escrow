import React from 'react';
import { CircularProgress, Grid } from '@mui/material';


const Loading = () => (    
  <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center" style={{ maxHeight: '100vh' }}>
    <Grid item xs={3}>
      <CircularProgress color='secondary'/>
    </Grid>
  </Grid>
);


export default Loading;
