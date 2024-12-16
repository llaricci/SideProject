import * as React from "react";

import Card from "@mui/material/Card";

import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

import Image from "next/image";
import logo from '../../components/images/logo.png'


export default function FavoritesTest()
{
    return (
        <div className = "bg-white text-black">
        <Typography
        variant="h2"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold", marginTop: 2 }}
        >
        Favorites Page
      </Typography>

      <div className="grid grid-cols-3 place-items-center gap-3">

        <Card>
            <CardContent>

            <div className="flex justify-center">
                <Image
                    src = {logo}
                    width = {100}
                    height = {100}
                    alt = "Image Logo"
                />
            </div>
                
                <Typography variant="h2" component="div">
                    SideProject
                </Typography>
                <br />
                <Divider />
                <br />
                <Typography variant="h6" component="div">
                by: Fuecoco FireCroc
                </Typography>
                <br />
                <Divider />
                <br />
                <Typography variant="h6" component="div">
                Technologies Used: C++, Java, SQL
                </Typography>
                <br />
                <Divider />
                <br />
                <Button>
                    Remove Favorite
                </Button>
            </CardContent>
        </Card>

        <Card>
            <CardContent>

            <div className="flex justify-center">
                <Image
                    src = {logo}
                    width = {100}
                    height = {100}
                    alt = "Image Logo"
                />
            </div>
                
                <Typography variant="h2" component="div">
                SideProject
                </Typography>
                <br />
                <Divider />
                <br />
                <Typography variant="h6" component="div">
                by: Fuecoco FireCroc
                </Typography>
                <br />
                <Divider />
                <br />
                <Typography variant="h6" component="div">
                Technologies Used: C++, Java, SQL
                </Typography>
                <br />
                <Divider />
                <br />
                <Button>
                    Remove Favorite
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardContent>

            <div className="flex justify-center">
                <Image
                    src = {logo}
                    width = {100}
                    height = {100}
                    alt = "Image Logo"
                />
            </div>
                
                <Typography variant="h2" component="div">
                    SideProject
                </Typography>
                <br />
                <Divider />
                <br />
                <Typography variant="h6" component="div">
                by: Fuecoco FireCroc
                </Typography>
                <br />
                <Divider />
                <br />
                <Typography variant="h6" component="div">
                Technologies Used: C++, Java, SQL
                </Typography>
                <br />
                <Divider />
                <br />
                <Button>
                    Remove Favorite
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardContent>

            <div className="flex justify-center">
                <Image
                    src = {logo}
                    width = {100}
                    height = {100}
                    alt = "Image Logo"
                />
            </div>
                
                <Typography variant="h2" component="div">
                    SideProject
                </Typography>
                <br />
                <Divider />
                <br />
                <Typography variant="h6" component="div">
                by: Fuecoco FireCroc
                </Typography>
                <br />
                <Divider />
                <br />
                <Typography variant="h6" component="div">
                Technologies Used: C++, Java, SQL
                </Typography>
                <br />
                <Divider />
                <br />
                <Button>
                    Remove Favorite
                </Button>
            </CardContent>
        </Card>
        <Card>
            <CardContent>

            <div className="flex justify-center">
                <Image
                    src = {logo}
                    width = {100}
                    height = {100}
                    alt = "Image Logo"
                />
            </div>
                
                <Typography variant="h2" component="div">
                    SideProject
                </Typography>
                <br />
                <Divider />
                <br />
                <Typography variant="h6" component="div">
                by: Fuecoco FireCroc
                </Typography>
                <br />
                <Divider />
                <br />
                <Typography variant="h6" component="div">
                Technologies Used: C++, Java, SQL
                </Typography>
                <br />
                <Divider />
                <br />
                <Button>
                    Remove Favorite
                </Button>
            </CardContent>
        </Card>
    </div>
        </div>

    )


}
