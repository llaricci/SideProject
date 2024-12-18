import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { Divider } from "@mui/material";

import AddFavoriteModal from "./modals/AddFavoriteModal";
import DeleteFavoriteModal from "./modals/DeleteFavoriteModal";

import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

function AllProjectsList(props) 
{
  
  const [addFavoritesForm, showAddFavoritesForm] = useState(false);
  const [addFavorite, setAddFavorite] = useState(false);
  
  const [deleteFavoritesForm, showDeleteFavoritesForm] = useState(false);
  const [deleteFavorite, setDeleteFavorite] = useState(false);

  const handleOpenDeleteModal = (project) => {
    showDeleteFavoritesForm(true);
    setDeleteFavorite(project);
  };

  const handleOpenAddModal = (project) => {
    showAddFavoritesForm(true);
    setAddFavorite(project);
  };

  const handleCloseModals = () => {
    showAddFavoritesForm(false);
    showDeleteFavoritesForm(false);
  };
  

  const projectList = props.projectList;

  let currentUser = props.currentUser;

  console.log(currentUser);

  return (
    <div className = "grid grid-cols-3 place-items-center gap-2">
      
        {projectList.map((project) => (
          <Card key={project._id} sx={{ width: "75%", marginBottom: "20px" }}>
            <CardContent>
              <Typography variant="h3" component="div">
                {project.name}
              </Typography>
              <br />
              <Divider sx={{ borderBottomWidth: 5 }} />
              <br />
              <Typography variant="h4" component="div">
                by: {project.creator.firstName} {project.creator.lastName}
              </Typography>
              <br />
              <Divider sx={{ borderBottomWidth: 5 }} />
              <br />
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Technologies: {project.technologies.join(", ")}
              </Typography>
            </CardContent>
            <CardActions className="flex justify-center">
            <Button size="large" color = "info" variant = "contained" href={`/projects/${project._id}`}>
                    View Details
              </Button>         
            </CardActions>

            <CardActions className="flex justify-center">
            {currentUser.favoriteProjects.some(projectObj => projectObj._id === project._id) ? (
              <Button size="large" color="info" variant="contained" onClick={() => {
                handleOpenDeleteModal(project);
              }}>
                <HeartBrokenIcon color="error" /> Remove Favorite
              </Button>
            ) : (
              <Button size="large" color="info" variant="contained" onClick={() => {
                handleOpenAddModal(project);
              }}>
                <FavoriteIcon color="error" /> Add Favorite
              </Button>
            )}
            </CardActions>
           
          </Card>
        ))}

        {addFavoritesForm && addFavorite && (
          <AddFavoriteModal
            isOpen={addFavoritesForm}
            project={addFavorite}
            user={currentUser}
            handleClose={handleCloseModals}
          />
        )}

        {deleteFavoritesForm && deleteFavorite && (
          <DeleteFavoriteModal
            isOpen={deleteFavoritesForm}
            project={deleteFavorite}
            user={currentUser}
            handleClose={handleCloseModals}
          />
        )}
      </div>

  );
}

export default AllProjectsList;
