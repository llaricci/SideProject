import * as React from "react";
import Card from "@mui/material/Card";
import {useState, useEffect} from 'react';
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Image from "next/image";
import logo from "./images/logo.png";
import HeartBrokenIcon from '@mui/icons-material/HeartBroken';
import DeleteFavoriteModal from "./modals/DeleteFavoriteModal";


function Favorites (props)
{
    let favoritesList = props.favorites;
    
    console.log(favoritesList);

    const [deleteForm, showDeleteForm] = useState(false);
    const [deleteFavorite, setDeleteFavorite] = useState(false);

    const handleOpenDeleteModal = (favorite) => 
    {
        showDeleteForm(true);
        setDeleteFavorite(favorite);
    };
    
      const handleCloseModals = () => 
    {
        showDeleteForm(false);
    };
    
    return (
        <div className = "bg-white text-black">
        <Typography
        variant="h2"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold", marginTop: 2 }}
        >
        Favorites Page
      </Typography>
    
      <div className="grid grid-cols-3 gap-3 place-items-center ">

      {favoritesList && favoritesList.map((favorite) => (
        <Card 
            key={favorite._id}> 
            <CardContent>
            <div className="flex justify-center">
            {logo && (
                <Image
                    src={logo}
                    width={100}
                    height={100}
                    alt="Image Logo"
                />
            )}
            </div>
                <Typography variant="h2" component="div">
                    {favorite.name}
                </Typography>
                <br />
                <Divider />
                <br />
                <Typography variant="h6" component="div">
                    by: {favorite.creator.firstName} {favorite.creator.lastName}
                </Typography>
                <br />
                <Divider />
                <br />
                <Typography variant="h6" component="div">
                Uses: {favorite.technologies.join(', ')} 
                </Typography>
                <br />
                <Divider />
                <br />
                <Button size = "large" variant = "contained" color = "info" href = {`/projects/${favorite._id}`}>
                    View Details
                </Button>
                <br />
                <br />
                <Button
                size="large"
                variant = "contained" 
                color = "info"
                
                onClick={() => {
                  handleOpenDeleteModal(favorite);
                }}
                >
                    <HeartBrokenIcon color="error" />
                    Remove Favorite
                </Button>
            </CardContent>
        </Card>
    ))}

    {deleteForm && deleteFavorite && (
          <DeleteFavoriteModal
            isOpen={deleteForm}
            project={deleteFavorite}
            user={props.user}
            handleClose={handleCloseModals}
          />
        )}


        
    </div>
        </div>

    )
}

export default Favorites;
