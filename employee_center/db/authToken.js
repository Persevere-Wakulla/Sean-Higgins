import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'mySecret', (err, user) => {

        if (err) return res.sendStatus(403);

        req.user = user;

        next();
    })
}

export const isExpired = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, 'mySecret', (err, user) => {

    if (err) return res.sendStatus(403);
})
}


export const generateAccessToken = (username) => {
  return jwt.sign({ username }, "mySpecialSecret", { expiresIn: "1hr" });
};
