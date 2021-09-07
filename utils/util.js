const { getInfo } = require("ytdl-getinfo");
const axios = require("axios");
const { yt_api, playlist_url, user_id } = require("../secrets");


const fetchTrack = async (id) => {
  const songs = [];
  const notFoundTrack = [];

  for (let i = 0; i < id.length; i++) {
    let info = await getInfo(id[i]).catch(err=>console.log(err));
    let track = info.items[0].track;
    let artist = info.items[0].artist;
    if(track && artist){
      if (track.indexOf("(") > 0 || track.indexOf("-") > 0) {
        track = track.slice(0, track.indexOf("("));
        track = track.slice(0, track.indexOf("-"));
      }
      songs.push({ name: track, artist: artist });
    } else{
      track = info.items[0].title;
      
      if (track.indexOf("(") > 0 || track.indexOf("-") > 0) {
        track = track.slice(0, track.indexOf("("));
        track = track.slice(0, track.indexOf("-"));
      }
      if(info.items[0].categories[0] === "Music"){
        songs.push({ name: track, artist: null });
      } else{
        notFoundTrack.push({video:id[i], name: track, artist: artist, categories:info.items[0].categories})
      }
    }
  }
  return [songs,notFoundTrack];
};

const getVideoList = async () => {
  let videoList = [];

  let url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=25&playlistId=${playlist_url}&key=${yt_api}`;
  let { data } = await axios.get(url).catch(err=>{console.error(err)});
  data.items.map(async (video, i) => {
    videoList.push("https://www.youtube.com/watch?v=" + video.snippet.resourceId.videoId);
  });
  
  let [trackNameList,notFound] = await fetchTrack(videoList);
  // const a = await getTrackName(id);
  return [trackNameList,notFound];
};



const createPlaylist = async () => {
  // get all Playlist

  let { data } = await axios.get("https://api.spotify.com/v1/me/playlists");
  let flag = true;
  let id = null;

  data.items.map((item, i) => {
    if (item.name === "YouTube Liked Song") {
      id = item.id;
      flag = false;
    }
  });
  if (flag) {
    // create playlist
    let { data } = await axios.post(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
      name: "YouTube Liked Song",
      description: "YouTube Liked Song",
      public: true,
    });
    // use the access token to access the Spotify Web API
    id = data.id;
  }
  return id;
};

const search = async (name) => {
  let { data } = await axios.get(`https://api.spotify.com/v1/search?q=${name.name}&type=track&limit=10`);

  let a = data.tracks.items.map((item,i)=>{
    // console.log(item.artists.length,item.artists[0].name);
    // item.artists.map(art=>console.log(art.name))
    // if(item.artists[0].name === name.artist){
    if(name.artist && name.artist.includes(item.artists[0].name)){
      return [true,i];
    } 
    return [false];
  })
  .filter(item=>item[0])
  let uri;
  if(a.length > 0){
    uri = data.tracks.items[a[0][1]].uri; 
} else{
  uri = data.tracks.items[0].uri;
}
  return uri;
};

const addSong = async (id, url) => {
  let { data } = await axios.post(`https://api.spotify.com/v1/playlists/${id}/tracks?uris=${url}`);
  return data;
};

module.exports = {search,addSong,getVideoList,createPlaylist}