import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import { Checkbox, FormControlLabel, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";


interface taskProps {
    title: string;
    description: string;
    _id: string;
}

export default function Landing() {
    const [taskData, setTaskData] = useState<taskProps[]>([]);
    const [ title, setTitle ] = useState<string>('');
    const [ description, setDescription ] = useState<string>('');
    
    useEffect(() => {
        async function getdata() {
        try {
            const response = await axios.get("http://localhost:3000/task", {
            headers: {
                "authorization": "Bearer " + localStorage.getItem("key"),
            },
            });
            setTaskData(response.data.tasks);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        }
    
        getdata();
    }, []);

    const handleCreateTask = async () => {
        try {
            const response = await axios.post("http://localhost:3000/task",{title, description} ,{
            headers: {
                "authorization": "Bearer " + localStorage.getItem("key"),
            },
            });
            alert(response.data.message);
            window.location.assign('/home');
        } catch (error) {
            console.error("Error fetching data:", error);
        }
      };

    return (
        <div>
          <div style={{display:"flex",margin:10,justifyContent: "center"}}> 
          <h1>Create Task</h1>
          </div>
          
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ margin: 20 }}>
              <TextField
                id="standard-basic"
                label="Title"
                variant="standard"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div style={{ margin: 20 }}>
              <TextField
                id="standard-basic"
                label="Description"
                variant="standard"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div style={{ margin: 33 }}>
              <Button variant="contained" onClick={handleCreateTask}>
                Create Task
              </Button>
            </div>
          </div>
    
          <div>
            {taskData.map((task) => (
              <ShowTodo
                key={task._id}
                title={task.title}
                description={task.description}
                _id={task._id}
              />
            ))}
          </div>
        </div>
      );
    }

    
function ShowTodo(props: taskProps) {
  const [finished, setFinished] = useState<boolean>(false);

  const handleTaskCompleted = async () => {
    try {
        await axios.delete(`http://localhost:3000/task/${props._id}/done`, {
          params: { finished },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("key"),
          },
        });
        setFinished(true);
      } catch (error) {
        console.error("Error marking task as completed:", error);
      }
    };

  return (
    <div style={{ display: "inline-grid" }}>
      <Box sx={{ maxWidth: 500, margin: 5 }}>
        <Card variant="outlined" style={{ backgroundColor: "#E2E2E2" }}>
          <CardContent>
            <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
              {props.title}
            </Typography>
            <Typography variant="h5" component="div">
              {props.description}
            </Typography>
          </CardContent>
          <CardActions>
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={finished}
                  onChange={() => {
                    setFinished(!finished);
                    handleTaskCompleted();
                  }}
                />
              }
              label="Task Completed"
            />
          </CardActions>
        </Card>
      </Box>
    </div>
  );
}
