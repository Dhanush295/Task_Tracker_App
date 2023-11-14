import * as React from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';

function AppBar() {
    
    
        return(
            <div style={{display: 'flex',backgroundColor:"black", color:"white" ,justifyContent: 'space-between'}}> 
                <div style={{padding: 10, color:"white", fontWeight: 'bolder'}}>
                <Typography variant="h4" component="h2" >Task Manager</Typography>

                </div>
                <div style={{display: 'flex', padding: 10}}>
                    <div style={{padding: 10}}>
                    <Typography color={"white"} variant='h5'></Typography>
                    </div>
                    <div style={{padding: 10}}>
                        <Button variant="contained"> Logout</Button>
                    </div> 
                </div>
            </div>
        )
    }

export default AppBar;