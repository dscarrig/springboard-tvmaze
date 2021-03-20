/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {

  const result = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  const showArray = []

  for(let i = 0; i < result.data.length; i++){
    showArray[i] = result.data[i].show;
  }

  console.log(showArray);

  return showArray;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  let image;
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    if(show.image){
      image = show.image.medium;
    }
    else{
      image = "600px-No_image_available.svg.png";
    }

    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}" id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <img class="card-img-top" src=${image}>
              <br>
             <button class="btn btn-primary" id="ep-button">Episodes</button>
           </div>

           <section style="display: none" id="episodes-area">
            <h3>Episodes</h3> 
            <ul id="episodes-list">
            </ul>
          </section>  
           
         </div>
       </div>
      `);

    $showsList.append($item);
  }

}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

//Adds listener to episode button
document.querySelector("body").addEventListener("click", function(e){
  if(e.target.id === "ep-button"){
    const id = e.target.parentElement.parentElement.getAttribute("data-show-id");
    populateEpisodes(id);
  }
})

//Returns array of episode data
async function getEpisodes(id) {
  const episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  return episodes.data;
}

//Populate episodes in the episode list
async function populateEpisodes(id) {

  const $thisShow = $(`#${id}`);
  const episodes = await getEpisodes(id);

  if($thisShow.find("#episodes-area").attr("style") === "display: none"){

    for (let episode of episodes) {
      let $item = $(
        `<div class="col-12"">
             <div class="card-body">
               <h5 class="card-title">${episode.name}</h5>
               <p class="card-text">${episode.airdate}</p>
               <p class="card-text">${episode.summary}</p>
             </div>
           </div>
         </div>
        `);
  
      $thisShow.find("#episodes-list").append($item);
    }
    $thisShow.find("#episodes-area").attr("style", "display: block");
  }

}
