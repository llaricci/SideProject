import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Divider from "@mui/material/Divider";

//modal stuff
import AddProjectModal from "../components/modals/AddProjectModal";
import { useState } from "react";

function Profile({ user }) {
  //modal stuff
  const [showAddModal, setShowAddModal] = useState(false);

  const handleOpenAddModal = () => {
    setShowAddModal(true);
  };

  const handleCloseModals = () => {
    setShowAddModal(false);
    // setShowEditModal(false);
    //setShowDeleteModal(false);
  };
  //
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "stretch",
        height: "100vh",
      }}
    >
      <Card
        variant="outlined"
        sx={{ maxWidth: 1000, width: "100%", flexDirection: "column" }}
      >
        <CardContent sx={{}}>
          <Typography variant="h2" component="div">
            {user.firstName} {user.lastName}
          </Typography>
          <br />
          <Typography variant="overline" gutterBottom sx={{ display: "block" }}>
            Email: {user.email}
          </Typography>
          <br />
          <Divider sx={{ borderBottomWidth: 5 }} />
          <br />
          <Typography variant="h4">About Me: {user.bio}</Typography>
          <br />
          <Divider sx={{ borderBottomWidth: 5 }} />
          <br />

          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDownwardIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography>Proficient Technologies:</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{user.profLanguages.join(", ")}</Typography>
            </AccordionDetails>
          </Accordion>
        </CardContent>
        <CardActions sx={{ marginTop: "auto" }}>
          <Button size="large">Edit Profile</Button>
          <Button size="large">Delete Profile</Button>
        </CardActions>
        <Button size="large" onClick={() => handleOpenAddModal()}>
          Add Project
        </Button>

        {showAddModal && (
          <AddProjectModal
            user={user}
            isOpen={showAddModal}
            handleClose={handleCloseModals}
          />
        )}
      </Card>
    </Box>
  );
}

export default Profile;
