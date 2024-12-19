'use client';

import { useState, useEffect } from 'react';
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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

import Link from "next/link";
import { auth } from "@/lib/config/firebaseAuth";

function Header() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);

  if (loading) {
    return null; // Optionally show a spinner or placeholder while loading
  }

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

            <Button color="inherit" href="/search">
              <p className="text-[16px] font-bold text-gray-800">
                <SearchIcon />
                Search
              </p>
            </Button>

            {user ? (
              <>
                {/* Menu items for logged-in users */}
                <Button color="inherit">
                  <Link href={`/users/${user.uid}/favorites`}>
                    <p className="text-[16px] font-bold text-gray-800">
                      <FavoriteIcon color="error" />
                      Favorites
                    </p>
                  </Link>
                </Button>
                <Button color="inherit">
                  <Link href="/users">
                    <p className="text-[16px] font-bold text-gray-800">
                      <PersonIcon />
                      All Users
                    </p>
                  </Link>
                </Button>
                <Button color="inherit">
                  <Link href="/projects">
                    <p className="text-[16px] font-bold text-gray-800">
                      <IntegrationInstructionsIcon />
                      All Projects
                    </p>
                  </Link>
                </Button>
                <Button color="inherit">
                  <Link href={`/users/${user.uid}`}>
                    <p className="text-[16px] font-bold text-gray-800">
                      <AccountCircleIcon />
                      Profile
                    </p>
                  </Link>
                </Button>
                <Button
                  color="inherit"
                  onClick={() => {
                    signOut(auth).then(() => {
                      router.push('/');
                    });
                  }}
                >
                  <p className="text-[16px] font-bold text-gray-800">
                    <AccountCircleIcon />
                    Logout
                  </p>
                </Button>
              </>
            ) : (
              <>
                {/* Menu items for guests */}
                <Button color="inherit">
                  <Link href="/login">
                    <p className="text-[16px] font-bold text-gray-800">
                      <AccountCircleIcon />
                      Login
                    </p>
                  </Link>
                </Button>
                <Button color="inherit">
                  <Link href="/signup">
                    <p className="text-[16px] font-bold text-gray-800">
                      <AccountCircleIcon />
                      Sign Up
                    </p>
                  </Link>
                </Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}

export default Header;
