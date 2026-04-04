# Student Center Redesign

React prototype for CECS 448 Project 2 (User-Centered Design), focused on improving usability for students who need to quickly find high-priority academic and financial information.

## How to Run

1. Open a terminal in this project folder.
2. Run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000`.

## Problem This Prototype Solves

Primary usability issue addressed: information overload in student portals.

Students often need only a subset of urgent information (next class, financial status, deadlines), but dashboard interfaces usually show everything at once. This increases cognitive load and slows task completion.

## User-Centered Design Decisions

The prototype applies user-centered design by prioritizing likely student goals first:

1. Check immediate status (holds, charges, urgent notices).
2. Check upcoming classes.
3. Complete a common action quickly (enroll, pay, view aid).
4. Access support resources when needed.

Implemented support for these goals:

1. Essentials-first layout reduces non-critical content for quick scanning.
2. Prioritized card accents visually separate high-level categories.
3. Quick Action search supports recognition and faster retrieval.
4. Status pills provide immediate, glanceable system feedback.