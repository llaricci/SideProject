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

function AllProjectsList(props) {
  const projectList = props.projectList;
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
              <Button size="large">
                <Link href={`/projects/${project._id}`}>
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

export default AllProjectsList;
