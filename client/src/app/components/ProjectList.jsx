import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import EditProjectModal from "./modals/EditProjectModal";
import DeleteProjectModal from "./modals/DeleteProjectModal";

function ProjectList(props) {
  const projectList = props.projectList;
  const [editForm, showEditForm] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const [deleteForm, showDeleteForm] = useState(false);
  const [deleteProject, setdeleteProject] = useState(false);

  const handleOpenEditModal = (project) => {
    showEditForm(true);
    setEditProject(project);
  };

  const handleOpenDeleteModal = (project) => {
    showDeleteForm(true);
    setdeleteProject(project);
  };

  const handleCloseModals = () => {
    showEditForm(false);
    showDeleteForm(false);
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

              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Comments:{" "}
                {project.comments && project.comments.length > 0
                  ? project.comments.map((comment) => comment.user).join(", ")
                  : "No comments yet"}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="large">View Details</Button>
            </CardActions>
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
          </Card>
        ))}

        {editForm && editProject && (
          <EditProjectModal
            isOpen={editForm}
            user={props.user}
            project={editProject}
            handleClose={handleCloseModals}
          />
        )}
        {deleteForm && deleteProject && (
          <DeleteProjectModal
            isOpen={deleteForm}
            project={deleteProject}
            user={props.user}
            handleClose={handleCloseModals}
          />
        )}
      </div>
    </div>
  );
}

export default ProjectList;
