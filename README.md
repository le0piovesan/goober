![Banner](./public/repo/banner.png)

## Overview

Goober is a PWA (Progressive Web Application) ride-share taxi service designed to connect riders with available drivers, providing a seamless experience for all users.

## Table of Contents

- [Technical Overview](#technical-overview)
- [Product Decisions and Tradeoffs](#product-decisions-and-tradeoffs)
- [Risk and Unknowns](#risk-and-unknowns)
- [ERD Schema, PWA and Lint](#erd-schema-pwa-and-lint)
- [Developer Roadmap](#developer-roadmap)
- [Installation and Guide](#installation-and-guide)

## Technical Overview

### Frontend

- **Framework:** [Next.js](https://nextjs.org/)
- **UI Library:** [Chakra UI](https://chakra-ui.com/)
- **State Management:** [React Context API](https://react.dev/reference/react/useContext)
- **CSS Framework:** [Tailwind CSS](https://tailwindcss.com/)
- **JavaScript Engine:** [T3](https://create.t3.gg/)
- **Type-checking:** [TypeScript](https://www.typescriptlang.org/)

### Backend

- **Server Framework:** [tRPC](https://trpc.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Real-time Features:** [Supabase](https://supabase.com/)

### Infrastructure

- **Deploy:** [Vercel](https://vercel.com/)
- **Production Logging:** [Axiom](https://axiom.co/)

## Product Decisions and Tradeoffs

Oh, what a ride. I am always grateful for the chance to learn new technologies such as Supabase and T3, while simultaneously striving for this great opportunity.
While I had previous experience with Firebase, it offered a solid foundation but also presented its own set of challenges on the way.

Since we didn't need to waste time implementing any complex authentication/user profiles, instead I've created a simple register/login page with a switch to choose between one of the 2 available personas (riders and drivers). This way, being able to create a corresponding model table for each and making the necessary relationships with the rest of the schema. Also, instead of using a real and complex auth system to validate, I decided instead to create my own simple validation custom hook with React Context, after login it validates the user email/encrypted password on the database, saves it to the context and local browser storage.  
Ultimately, this decision was made by thinking about flexibillity and scallability of the project.

The find driver algorithm was really fun to build, it took me back to the times where I worked at a startup and we used to brainstorm lots of ideas. The algorithm works in a way to ensure fair competition between drivers. It searches for the last location of the available drivers that are not in a ride, then filters and looks for the closest ones to the pickup location coords. If the are more than one in certain radius, it randomly chooses one.

I also decided to focus more on the front-end and design. The feature I found to be the most impressive was the responsiveness of the UX/UI layout in the WepApp. I consistently strive to prioritize accessibility in my development process.

I've developed the project within a week + couple days for bug fixes/refactoring/refining and estimate that it took about 44 hours in total, split between studying which tools to use, developing, and testing. Having to attend work while also taking care of some development and deployments at the same time made this challenge a bit more difficult. There is still room for improvement, but overall, I am really glad for what has already been accomplished.

- **Ride Request Process:**

  - Google Maps API integrations, featuring only necessary tools for an optimized map and easy ride requests.
  - Riders can request a ride, by only specifying pickup and dropoff locations.
  - Goober automatically dispatches available drivers, providing a quote based on trip distance and other factors.
  - Riders do not need to select a driver; the system handles the assignment.
  - Riders can cancel ongoing rides.

- **Driver Interaction:**

  - The app do some regular checks for drivers last location.
  - Drivers can receive ride requests and choose to either accept or decline.
  - If driver declines a ride, the algorithm automatically checks for another available driver and so on.
  - Each ride comes with an indication of the payment amount.
  - Once a ride is accepted, drivers won't receive new requests until the ride is complete.
  - Drivers receive relevant information for pickup and completion of the ride.
  - Drivers can cancel ongoing rides.

- **User Flow:**

  - Easy and quick registration/login flow.
  - Streamlined user flows for both riders and drivers.
  - Intuitive interfaces for requesting rides and managing ongoing rides.
  - Clear communication of ride details, including pickup and dropoff locations.
  - Notifications about the ride status changes.
  - Minimal user interactions to ensure a smooth experience.

## Risk and Unknowns

- **Risk:** Handling real-time updates and notifications efficiently.

  - **Resolution Plan:** Implement and test Supabase integration thoroughly. Ensure that transactions are commited/rollbacked successfully.

- **Unknown:** Scalability challenges as the user base grows.

  - **Resolution Plan:** Regularly assess application performance and scalability. Implement optimizations based on usage patterns.

## ERD Schema, PWA and Lint

![Banner](./public/repo/schema.png)
![Banner](./public/repo/PWA.png)
![Banner](./public/repo/lint.png)

## Developer Roadmap

- [x] **Project Initial Setup**

  - [x] Initialize Next.js project
  - [x] Configure Prisma with PostgreSQL
  - [x] Configure Supabase integration
  - [x] Create a simple user auth for logged in users
  - [x] Set up Tailwind CSS
  - [x] Set up Chakra UI

- [x] **Frontend Styling and UX**

  - [x] PWA implementation: write a serviceWorker, test with Lighthouse, etc
  - [x] Cleanup default layout
  - [x] Create initial pages
  - [x] Create initial components
  - [x] Implement user interactions and navigation
  - [x] Create some concept arts in Figma for the application and documentation
  - [x] Style frontend components
  - [x] Optimize for responsive design
  - [x] Refactoring

- [x] **Backend Integration**

  - [x] Define Prisma data model
  - [x] Implement backend logic using tRPC
  - [x] Add Image to Storage
  - [x] Realtime updates

- [x] **Documentation and Deployment**

  - [x] Deploy the application to Vercel
  - [x] Configure production log system with Axiom
  - [x] Create a detailed README.md

- **Future Implementations**
  - Add Cron to expired/completed rides
  - Set up OneSignal for notification
  - Implement some kind of offline support

## Installation and Guide

> In order to run locally download the .env file from the gist, or copy all its content and place in a .env file in the root of the project.

[Here is the .env file to run the app locally](https://gist.github.com/le0piovesan/666b6b96e89484987bcd60bf5b83c6f6) 🔐

Then run the following script to install dependencies, build and start the app:

```bash
npm install && npm run build-start
```

<hr/>

[Here is the link of the deployable app](https://goober-three.vercel.app/) 🚀

[Here is a quick video showing the features](https://youtu.be/w_8UuD_2oKA) 👀
