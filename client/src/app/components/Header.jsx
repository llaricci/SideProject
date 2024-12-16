import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';

import Link from "next/link";

function Header() {
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link className="text-3xl font-bold text-gray-800 mb-4" href="/">
                SideProject
              </Link>
            </Typography>

            <Button color="inherit" href = "/search">
                <p className="text-[16px] font-bold text-gray-800">
                <SearchIcon />
                  Search
                </p>
            </Button>

            <Button color="inherit">
              <p className="text-[16px] font-bold text-gray-800">
                <FavoriteIcon color = "error" />
                Favorites
              </p>
            </Button>
            
            <br />
            <Button color="inherit">
              <Link href="/users">
                <p className="text-[16px] font-bold text-gray-800">
                  <PersonIcon />
                  All Users
                </p>
              </Link>
            </Button>
            <Button color="inherit">
              <Link href="/users/testuser">
                <p className="text-[16px] font-bold text-gray-800">
                  View Profile
                </p>
              </Link>
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

export default Header;
