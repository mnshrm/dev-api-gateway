exports.createEvent = async (eventDetails) => {
  const resData = await (
    await fetch("https://events-api-0h8q.onrender.com/event", {
      method: "POST",
      body: JSON.stringify(eventObj),
      headers: {
        "Content-Type": "application/json",
      },
    })
  ).json();

  
};
