# Goober Web Application

## Banner

[TODO]

## Overview

Goober is a ride-share taxi service web application designed to connect riders with available drivers, providing a seamless experience for both user personas. The application is implemented as a TypeScript web app using React for the frontend, Node.js (Next.js) for the backend, and PostgreSQL as the preferred SQL database.

## Table of Contents

- [Technical Overview](#technical-overview)
- [Product Decisions](#product-decisions)
- [UX Decisions](#ux-decisions)
- [Risk and Unknowns](#risk-and-unknowns)
- [Figma Layout](#figma-layout)
- [Developer Roadmap](#developer-roadmap)

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
- **Logging:** [Axiom](https://axiom.co/)

## Product Decisions

- **Ride Request Process:**

  - Riders can request a taxi ride, specifying pickup and dropoff locations.
  - Goober automatically dispatches available drivers, providing a quote based on trip distance and other factors.
  - Riders do not need to select a driver; the system handles the assignment.
  - Riders can cancel ongoing rides.

- **Driver Interaction:**
  - Drivers can receive ride requests and choose to accept or decline.
  - Each ride comes with an indication of the payment amount.
  - Once a ride is accepted, drivers won't receive new requests until the ride is complete.
  - Drivers receive relevant information for pickup and completion of the ride.
  - Drivers can cancel ongoing rides.

## UX Decisions

- **User Flow:**

  - Streamlined user flows for both riders and drivers.
  - Intuitive interfaces for requesting rides and managing ongoing rides.
  - Clear communication of ride details, including pickup and dropoff locations.
  - Minimal user interactions to ensure a smooth experience.

- **Real-time Updates:**
  - Leverage Supabase for real-time updates on ride requests and status changes.
  - Provide notifications to both riders and drivers for important events (e.g., ride acceptance, cancellation).

## Risk and Unknowns

- **Risk:** Handling real-time updates and notifications efficiently.

  - **Resolution Plan:** Implement and test Supabase integration thoroughly. Explore strategies for optimizing real-time communication.

- **Unknown:** Scalability challenges as the user base grows.
  - **Resolution Plan:** Regularly assess application performance and scalability. Implement optimizations based on usage patterns.

## Figma Layout

[TODO]

## Developer Roadmap

- [ ] **Project Setup**

  - [x] Initialize Next.js project
  - [x] Configure Prisma with PostgreSQL
  - [x] Configure Supabase integration
  - [ ] Set up Tailwind CSS and Chakra UI
  - [ ] Implement basic frontend pages and components

- [ ] **Backend Integration**

  - [x] Define Prisma data model
  - [x] Implement backend logic using tRPC
  - [ ] Use Subscriptions / WebSockets

- [ ] **Frontend Styling and UX**

  - [ ] Design Figma responsive layout
  - [x] PWA implementation: write a serviceWorker, test with Lighthouse, etc
  - [ ] Style frontend components with Tailwind CSS and Chakra UI
  - [ ] Implement user interactions and navigation
  - [ ] Optimize for responsive design

- [ ] **Testing and Optimization**

  - [ ] Implement unit tests
  - [ ] Conduct performance optimization
  - [ ] Set up continuous integration for automated testing

- [ ] **Documentation and Deployment**

  - [ ] Document code and API endpoints
  - [ ] Create a detailed README.md
  - [x] Deploy the application to Vercel
  - [x] Configure production log system with Axiom
