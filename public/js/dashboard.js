let ui = new firebaseui.auth.AuthUI(auth);
let login = document.querySelector('.login');
const blogSection = document.querySelector('.blogs-section');

auth.onAuthStateChanged((user) => {
  if (user) {
    login.style.display = 'none';
  } else {
    setupLoginButton();
  }
});

const setupLoginButton = () => {
  ui.start('#loginUI', {
    callbacks: {
      signInSuccessWithAuthResult: function (authResult, redirectURL) {
        return false;
      },
    },
    signInFlow: 'popup',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  });
};

db.collection('blogs')
  .get()
  .then((blogs) => {
    blogs.forEach((blog) => {
      if (blog.id != decodeURI(location.pathname.split('/').pop())) {
        createBlog(blog);
      }
    });
  });

const createBlog = (blog) => {
  let data = blog.data();
  blogSection.innerHTML += `
    <div class="blog-card">
        <img src="${data.bannerImage}" class="blog-image" alt="">
        <h1 class="blog-title">${data.title.substring(0, 10) + '...'}</h1>
        <p class="blog-overview">${data.article.substring(0, 40) + '...'}</p>
        <a href="/${blog.id}" class="btn dark">read</a>
        <a href="/${blog.id}/editor" class="btn dark">edit</a>
        <a href="#" onclick="deleteBlog('${
          blog.id
        }')" class="btn dark">delete</a>
    </div>
    `;
};

const deleteBlog = (id) => {
  db.collection('blogs')
    .doc(id)
    .delete()
    .then(() => {
      location.reload();
    })
    .catch((error) => {
      console.log('Error deleteing the blog');
    });
};
