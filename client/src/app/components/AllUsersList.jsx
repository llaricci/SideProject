import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Link from "next/link";

function AllUsersList(props) {
  const userList = props.userList;
  return (
    <div className = "grid grid-cols-3 place-items-center gap-2">
      
        {userList.map((user) => (
          <Card key={user._id} sx={{ width: "75%", marginBottom: "20px" }}>
            <CardContent>
              <Typography variant="h3" component="div">
                {user.firstName} {user.lastName}
              </Typography>
              <br />
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Technologies: {user.profLanguages.join(", ")}
              </Typography>
              <br />
              <Typography variant="body2">
                {user.email}
                <br />
              </Typography>
              <br />
              <Typography variant="body2">
                {user.bio}
                <br />
              </Typography>
            </CardContent>
            <CardActions className="flex justify-center">
              <Button size="large">
                <Link href={`/users/${user._id}`}>
                  <p className="text-base font-bold text-blue-800 mb-4">
                    View Details
                  </p>
                </Link>
              </Button>
            </CardActions>
            <CardActions></CardActions>
          </Card>
        ))}
      </div>

  );
}

export default AllUsersList;
