import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FavoriteIcon from '@mui/icons-material/Favorite';
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';

import EditProjectModal from "./modals/EditProjectModal";
import DeleteProjectModal from "./modals/DeleteProjectModal";

import AddFavoriteModal from "./modals/AddFavoriteModal";
import DeleteFavoriteModal from "./modals/DeleteFavoriteModal";


import { useQuery } from "@apollo/client";
import queries from "../queries";
import { comment } from "postcss";

function ProjectList({projectList, user, isOwner, currentUser, favorites}) {
 
  const [editForm, showEditForm] = useState(false);
  const [editProject, setEditProject] = useState(false);

  const [deleteForm, showDeleteForm] = useState(false);
  const [deleteProject, setdeleteProject] = useState(false);

  const [addFavoritesForm, showAddFavoritesForm] = useState(false);
  const [addFavorite, setAddFavorite] = useState(false);



  const [deleteFavoritesForm, showDeleteFavoritesForm] = useState(false);
  const [deleteFavorite, setDeleteFavorite] = useState(false);

  const handleOpenEditModal = (project) => {
    showEditForm(true);
    setEditProject(project);
  };

  const handleOpenDeleteModal = (project) => {
    showDeleteForm(true);
    setdeleteProject(project);
  };

  const handleOpenDeleteFavoriteModal = (project) => {
    showDeleteFavoritesForm(true);
    setDeleteFavorite(project);
  };

  const handleOpenAddModal = (project) => {
    showAddFavoritesForm(true);
    setAddFavorite(project);
  };

  const handleCloseModals = () => {
    showEditForm(false);
    showDeleteForm(false);
    showAddFavoritesForm(false);
    showDeleteFavoritesForm(false);
  };

  return (
    <div>
      <Typography
        variant="h2"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold", marginTop: 2 }}
      >
        Project List:
      </Typography>
      <div
        style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
      >
        {projectList.length === 0 ? <div>No Projects yet</div> : null}
        {projectList.map((project) => (
          <Card key={project._id} sx={{ width: "75%", marginBottom: "20px" }}>
            <CardContent>
              <Typography variant="h3" component="div">
                {project.name}
              </Typography>
              <br />
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Technologies: {project.technologies.join(", ")}
              </Typography>
              <br />
              <Typography variant="body2">
                {project.description}
                <br />
              </Typography>
              <br />
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Favorited by:{" "}
                {project.favoritedBy && project.favoritedBy.length > 0
                  ? project.favoritedBy
                      .map((user) => user.firstName + " " + user.lastName)
                      .join(", ")
                  : "No one yet"}
              </Typography>
              <p className="font-bold">Comments: </p>
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                {project.comments && project.comments.length > 0
                  ? project.comments
                      .map(
                        (comment) =>
                          comment.user.firstName +
                          ": " +
                          comment.comment.slice(0, 10) +
                          "..."
                      )
                      .join(", ") + "\n"
                  : "No comments yet"}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="large" color = "info" variant = "contained" href={`/projects/${project._id}`}>
                View Details
              </Button>
            </CardActions>

          {isOwner && 
            <CardActions>
              <Button
                size="large"
                onClick={() => {
                  handleOpenEditModal({ project });
                }}
              >
                Edit Project
              </Button>
              <Button
                size="large"
                onClick={() => {
                  handleOpenDeleteModal({ project });
                }}
              >
                Delete Project
              </Button>
            </CardActions>
          }

          {!isOwner && !favorites.some((fav) => fav._id === project._id) && (
            <CardActions>
              <Button
                size="large"
                variant = "contained"
                color = "info"
                onClick={() => {
                  handleOpenAddModal(project );
                }}
              >
                <FavoriteIcon color="error" />
                Add Favorite
              </Button>
            </CardActions>
          )}

          {!isOwner && favorites.some((fav) => fav._id === project._id) && (
            <CardActions>
              <Button
                size="large"
                variant = "contained"
                color = "info"
                onClick={() => {
                  handleOpenDeleteFavoriteModal(project );
                }}
              >
                <HeartBrokenIcon color="error" />
                Remove Favorite
              </Button>
            </CardActions>
          )}

          </Card>
        ))}

        

        {editForm && editProject && (
          <EditProjectModal
            isOpen={editForm}
            user={user}
            project={editProject}
            handleClose={handleCloseModals}
          />
        )}

        {deleteForm && deleteProject && (
          <DeleteProjectModal
            isOpen={deleteForm}
            project={deleteProject}
            user={user}
            handleClose={handleCloseModals}
          />
        )}

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
    </div>
  );
}

export default ProjectList;
