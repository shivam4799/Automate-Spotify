const axios = require("axios");
var readline = require("readline");
const { spotify_token } = require("./secrets");
const { getVideoList, createPlaylist, search, addSong } = require("./utils/util");


start = async () =>{
  let songs = await getVideoList();
  axios.defaults.headers.common["Authorization"] = `Bearer ${spotify_token}`;

   axios.get("https://api.spotify.com/v1/me").then(async res=>{
      userId = res.data.id;
    }).catch(err => {console.error(err.response.data.error.status,err.response.data.error.message );
    console.log("generate new token from here: https://developer.spotify.com/console/post-playlists/");
    });

  let id = await createPlaylist();
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    let uri = await search(song);
    let add = await addSong(id, uri);
  }
  console.log("success");
};

start();
