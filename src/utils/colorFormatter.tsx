export const colorStatus = (status: string) => {
  switch (status) {
    case "REQUESTED":
    case "You have a new ride request":
      return "yellow";
    case "ONGOING":
    case "You have accepted the ride":
      return "green";
    case "You have declined this ride":
      return "blue";
    case "CANCELED":
    case "The rider has canceled the ride":
      return "red";
    case "You have canceled the ride":
      return "orange";
    case "FINISHED":
    case "Ride completed! 🚀":
      return "primary";
    default:
      return "gray";
  }
};
