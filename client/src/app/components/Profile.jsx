import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Divider from '@mui/material/Divider';

function Profile({ user }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', height: '100vh' }}>
      <Card variant="outlined" sx={{ maxWidth: 1000, width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h2" component="div">
            {user.name}
          </Typography>
        <br />
          <Typography variant="overline" gutterBottom sx={{ display: 'block' }}>
                Email: {user.email}
        </Typography>
          <br />
          <Divider sx={{ borderBottomWidth: 5 }} />
          <br />
          <Typography variant="h4">
            About Me: {user.bio}
          </Typography>
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
              <Typography>
                {user.profLanguages.join(", ")}
              </Typography>
            </AccordionDetails>
          </Accordion>
        </CardContent>
        <CardActions sx={{ marginTop: 'auto' }}>
          <Button size="large">Edit Profile</Button>
          <Button size="large">Delete Profile</Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default Profile;
