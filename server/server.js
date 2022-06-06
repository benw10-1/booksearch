const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

const { typeDefs, resolvers } = require('./schemas');
const { ApolloServer } = require('apollo-server-express');

const app = express();
const PORT = process.env.PORT || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  playground: false,
  csrfPrevention: true,
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client/build')));

app.get("*" , (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  server.start().then(() => {
    server.applyMiddleware({
      app,
      cors: true
    })
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`)
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
    })
  })
})
