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

## Design Principles and Guidelines Applied

1. Visual Hierarchy: important sections appear first with stronger emphasis.
2. Recognition over Recall: quick actions and labels are visible and searchable.
3. Consistency and Standards: shared card, button, and spacing patterns.
4. Feedback and Visibility of System Status: hold/charge/status pills and clear mode states.
5. Aesthetic and Minimalist Design: Essentials mode removes less-critical details temporarily.
6. Accessibility Basics: semantic headings, labeled input, focus styles, and keyboard-usable controls.

## Scope Note (Prototype Requirement)

This is a front-end prototype intended to communicate interaction and usability improvements. Backend integration is intentionally out of scope for this assignment.

## Suggested 10-Minute Demo Flow

1. Show baseline screen and identify information overload issue.
2. Turn on `Essentials` mode and explain reduced cognitive load.
5. Show "Today’s Schedule" prioritization behavior (full schedule grouped in one clear section).
6. Summarize design principles used and why they fit this scenario.
6. Summarize design principles used and why they fit this scenario.

## Team Reflection Prompts (For Slides)

1. Which usability issue did we prioritize and why?
2. Which design principle changed our UI decisions most?
3. What tradeoffs did we make between completeness vs simplicity?
4. What would we improve next with user feedback/usability testing?
