const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  playground: false,
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/build')));

app.get("*" , (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
