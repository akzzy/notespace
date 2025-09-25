# **App Name**: NoteSpace

## Core Features:

- Create Note Space: Generates a 6-digit unique User ID and redirects the user to a dedicated Note Space URL.
- Add Notes: Allows users to add multiple notes within their Note Space.
- Edit and Delete Notes: Enables users to edit and delete existing notes.
- Display Notes: Lists all notes in reversed-chronological order, with the latest notes appearing at the top.
- Note Persistence: Stores all notes in MongoDB Atlas, associated with the user's unique ID for access from any device.
- Theme Selection: The UI/UX provides clear options to toggle between Light and Dark theme options.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) to evoke a sense of focus and clarity.
- Background color: Light gray (#F5F5F5) for a clean and modern look, ensuring readability.
- Accent color: Teal (#009688) to provide a contrasting highlight for interactive elements and important actions.
- Font: 'Inter' sans-serif for body and headlines, known for its clean, modern, and highly readable design, ensuring optimal legibility across devices.
- Simple, minimalist icons to represent actions like edit, delete, and save. These should be easily recognizable and visually consistent.
- A clean and responsive layout with a prominent note entry area and a scrollable list of notes. Utilize Tailwind CSS grid and flexbox for optimal content arrangement across devices.
- Subtle transitions and animations for actions like saving, deleting, and adding notes. These provide visual feedback and enhance the user experience without being distracting.