import * as React from 'react';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import axios from 'axios';


function AppBar() {
    const [user, setUser ] = React.useState<string | null>(null);

    React.useEffect(() => {
        async function getdata() {
          try {
            const response = await axios.get("http://localhost:3000/me", {
              headers: {
                "authorization": "Bearer " + localStorage.getItem("key")
              }
            });
            if(response.data.username){
                setUser(response.data.username);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        }
    
        getdata(); 
    
      }, []);

      const handleLogout = () => {
        localStorage.setItem("key", "");
        window.location.assign('/');
      };
    
    if(user){
        return(
            <div style={{display: 'flex',backgroundColor:"black", color:"white" ,justifyContent: 'space-between'}}> 
                <div style={{padding: 10, color:"white", fontWeight: 'bolder'}}>
                <Typography variant="h4" component="h2" >Task Manager</Typography>

                </div>
                <div style={{display: 'flex', padding: 10}}>
                    <div style={{padding: 10}}>
                    <Typography color={"white"} variant='h5'>{user}</Typography>
                    </div>
                    <div style={{padding: 10}}>
                        <Button variant="contained"
                        onClick={handleLogout}> Logout</Button>
                    </div> 
                </div>
            </div>
        )
    }
    return(
        <div style={{display: 'flex',backgroundColor:"black", color:"white" ,justifyContent: 'space-between'}}> 
            <div style={{padding: 10, color:"white", fontWeight: 'bolder'}}>
            <Typography variant="h4" component="h2" >Task Manager</Typography>

            </div>
            <div style={{display: 'flex', padding: 10}}>
                <div style={{padding: 10}}>
                </div>
                <div style={{padding: 10}}>
                    <Button variant="contained"
                    onClick={handleLogout}> SignUp</Button>
                </div> 
            </div>
        </div>
    )

        
    }

export default AppBar;