import React from 'react';
import ReactMarkdown from 'react-markdown';

import Comment from '../components/Comment';

const markdownContent = `
# Roommate Roulette 
---
## Technologies Used
- HTML, CSS, Javascript

---

## Description
- Roommate Roulette is a web-application designed to help students find roommate groups with others living in the same area.

---

## Number of Favorites
- 2

---  

## Favorited By
- Reshiram Dragon (reshiram@example.com)
- Zekrom Dragon (zekrom@example.com)

---
## Comments

`;

let comment =
{
    user:{
        _id: "testuser",
        firstName: "Fuecoco",
        lastName: "FireCroc",
        email: "fuecoco@example.com"
    },
    comment: "Nice project! Great use of GraphQL and TailwindCSS!"

}

function Project() {
    return (
        <div className = "justify-items-center"
            style={{ padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6'}}>
            <div className="w-1/2">
                <ReactMarkdown>{markdownContent}</ReactMarkdown>
                <style>
                    {` h1 { font-size: 2.5rem; font-weight: bold; }
                    h2 { font-size: 2rem; font-weight: bold; }
                    h3 { font-size: 1.75rem; font-weight: bold; }
                    p { font-size: 1rem; }
                    hr { border: none; border-top: 2px solid #ccc;  margin: 1.5rem 0; } `}
                </style>
                <div className="grid grid-cols-2 gap-2 mx-auto">
                    <Comment comment = {comment}/>
                    <Comment comment = {comment}/>
                    <Comment comment = {comment}/>
                    <Comment comment = {comment}/>
                    
                </div>
            </div>
        </div>
    );
}

export default Project;
