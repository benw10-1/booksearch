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
    }
    return res;
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

  return genQuery(q, {});
};

export const createUser = (userData) => {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

export const loginUser = (userData) => {
  return fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

// save book data for a logged in user
export const saveBook = (bookData, token) => {
  return fetch('/api/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });
};

// remove saved book data for a logged in user
export const deleteBook = (bookId, token) => {
  return fetch(`/api/users/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
