export const tagStatus = (status: string) => {
  switch (status) {
    case "REQUESTED":
    case "You have a new ride request":
      return { tag: "requested", color: "yellow" };
    case "ONGOING":
    case "Your ride has been accepted!":
      return { tag: "ongoing", color: "green" };
    case "You have declined this ride":
      return { tag: "declined", color: "blue" };
    case "CANCELED":
    case "The ride has been canceled by the Rider":
    case "The ride has been canceled by the Driver":
      return { tag: "canceled", color: "red" };
    case "You have canceled the ride":
      return { tag: "canceled", color: "orange" };
    case "FINISHED":
    case "Ride completed! 🚀":
      return { tag: "finished", color: "primary" };
    case "You have accepted the ride":
      return { tag: "accepted", color: "blue" };
    default:
      return { tag: "expired", color: "gray" };
  }
};
