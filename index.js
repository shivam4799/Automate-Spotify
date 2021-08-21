const axios = require("axios");
var readline = require("readline");
const { getVideoList, createPlaylist, search, addSong } = require("./utils/util");


async function start(callback) {
  console.log("Authorize spotify app by visiting this url: ", "http://localhost:8888/login");
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let access_token = null;
  rl.question("Enter the code from that page here: ", function (code) {
    rl.close();
    access_token = code;
    callback(access_token);
  });
}

const main = async (access_token) => {
  let songs = await getVideoList();
  axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;

  //  axios.get("https://api.spotify.com/v1/me").then(async res=>{
  //     userId = res.data.id;
  //     console.log(res.data);
  //   }).catch(err => console.error(err));

  let id = await createPlaylist();
  console.log("id", id);
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    let uri = await search(song);
    let add = await addSong(id, uri);
    console.log(add);
  }
  console.log("success");
};

// axios.defaults.headers.common["Authorization"] = `Bearer BQDRs3FKd0iuilu8cRwwTgJTHxz3htMpLunZADrfy8-LeMyXtgP0YweT1wTaayPc4KcX2RiojBSDuu-o62f14q6Sdt_WdBGKma87Jkm1H8SIoDtJ4SmQinU68wzJCe98yI6-EmhRu8HbP6zWdMWL6gEuUgI93hRi_rJMsSyxenFwEYHmRY40czP6SSQY_SAS1h0YHu-ZaoPf9rSlHwMR59ZBkqt8PT-C7pnpQ0AJagmpzcT-mnDJu9UA8TxYbg`;

// let songs = [
//   { name: "Girls Like You", artist: "Maroon 5" },
//   { name: "DUNIYAA", artist: "AKHIL,DHVANI BHANUSHALI" },
//   { name: "See You Again", artist: "Wiz Khalifa" },
// ];

// search( { name: "Don't Let Me Down", artist:"The Chainsmokers" });

start(main);
