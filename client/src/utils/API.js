import Auth from "./auth";

function genQuery(q, v) {
  const url = "/graphql";

  const body = {
    "query": q,
    "variables": v
  }

  const token = Auth.getToken();

  if (token && Auth.isTokenExpired(token)) {
    Auth.logout();
    return
  }

  const opt = {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "authorization": token ? `Bearer ${token}` : ''
    },
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(body)
  }

  return fetch(url, opt).then(res => res.json()).then(res => {
    if (res.errors) {
      console.log(res.errors);
      return {
        error: res.errors[0].message
      }
    }

    return {
      ...res.data,
      ok: true
    }
  }).catch(err => {
    console.log(err);
  });
}

// route to get logged in user's info (needs the token)
export const getMe = () => {
  const q = `
    query {
      me {
        _id
        username
        email
        savedBooks {
          bookId
          title
          authors
          description
          link
          image
        }
      }
    }
  `;

  return genQuery(q, {}).then(res => {
    return {
      ...res.me,
      ok: true
    };
  });
};

export const createUser = (userData) => {
  const q = `
    mutation addUser($username: String!, $email: String!, $password: String!) {
      addUser(username: $username, email: $email, password: $password) {
        token
        user {
          _id
          username
        }
      }
    }
  `;

  return genQuery(q, {
    username: userData.username,
    email: userData.email,
    password: userData.password
  }).then(res => {
    return {
      ...res.addUser,
      ok: true
    };
  })
};

export const loginUser = (userData) => {
  const q = `
    mutation login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        user {
          _id
          username
        }
      }
    }
  `;

  return genQuery(q, {
    email: userData.email,
    password: userData.password
  }).then(res => {
    return {
      ...res.login,
      ok: true
    };
  })
};

// save book data for a logged in user
export const saveBook = (bookData) => {
  const q = `
    mutation saveBook($bookData: BookInput!) {
      saveBook(bookData: $bookData) {
        _id
        username
        email
        savedBooks {
          bookId
          authors
          image
          description
          title
          link
        }
      }
    }
  `;

  return genQuery(q, {
    bookData: bookData
  }).then(res => {
    return {
      ...res.saveBook,
      ok: true
    };
  })
};

// remove saved book data for a logged in user
export const deleteBook = (bookId) => {
  const q = `
    mutation removeBook($bookId: ID!) {
      removeBook(bookId: $bookId) {
        _id
        username
        email
        savedBooks {
          bookId
          authors
          image
          description
          title
          link
        }
      }
    }
  `;

  return genQuery(q, {
    bookId: bookId
  }).then(res => {
    return {
      ...res.removeBook,
      ok: true
    };
  })
};

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`).then(res => res.json()).then(res => {
    return {
      ...res,
      ok: true
    }
  });
};
