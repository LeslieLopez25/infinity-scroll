const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let isInitialLoad = true;

// UNSPLASH API
let initialCount = 5;
const apiKey = "BFE1JoQBG5PhReEzpOwrQwy9dkQZMRd1SiFGg2qHTYo";
let apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${initialCount}`;

function updateAPIURLWithNewCount(picCount) {
  apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${picCount}`;
}

// CHECK IF ALL IMAGES WERE LOADED
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// HELPER FUNCTION TO SET ATTRIBUTES ON DOM ELEMENTS
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// CREATE ELEMENTS FOR LINKS & PHOTOS, ADD TO DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // RUN FUNCTION FOR EACH OBJECT IN photosArray
  photosArray.forEach((photo) => {
    // CREATE <a> TO LINK TO UNSPLASH
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });
    // CREATE <img> FOR PHOTO
    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    // EVENT LISTENER, CHECK WHEN EACH IS FINISHED LOADING
    img.addEventListener("load", imageLoaded);
    // PUT <img> INSIDE <a>, THEN PUT BOTH INSIDE imageContainer ELEMENT
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// GET PHOTOS FROM UNSPLASH API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
    if (isInitialLoad) {
      updateAPIURLWithNewCount(30);
      isInitialLoad = false;
    }
  } catch (error) {
    // CATCH ERROR HERE
  }
}

// CHECK TO SEE IF SCROLLING NEAR BOTTOM OF PAGE, LOAD MORE PHOTOS
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

// ON LOAD
getPhotos();
