export const getHealth = (req, res) => {
  res.send("Alive out here!");
};

export const getHowdy = (req, res) => {
  const name = req.query.name;
  if (!name) {
    return res.status(400).send("Name query parameter is required");
  }
  res.send(`Howdy, ${name}!`);
};
