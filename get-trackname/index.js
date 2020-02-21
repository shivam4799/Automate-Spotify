const puppeteer = require("puppeteer");

module.exports = getTrackName = async list => {
  const songData = {};
  const result = [];
  const browser = await puppeteer.launch({ headless: false });

  let page = [];

  for (let i = 0; i < list.length; i++) {
    page[i] = await browser.newPage();
    await page[i].goto(list[i], {
      waitUntil: "networkidle2"
    });

    await page[i].waitForSelector("#meta-contents", { timeout: 50000 });

    let temp = await page[i].evaluate(async () => {
      var data = document.querySelectorAll("#meta-contents #more");

      await data[0].click();
      var musicData = document.querySelectorAll("#meta-contents #collapsible");

      var heading = musicData[0].querySelectorAll(
        "ytd-metadata-row-renderer h4"
      );
      var headingData = musicData[0].querySelectorAll(
        "ytd-metadata-row-renderer #content"
      );

      var mainData = [];

      var HeadingArray = Array.from(heading).map(el => {
        return el.children[0].textContent;
      });
      var resultAraay = Array.from(headingData).map((el, i) => {
        if (i === 0) {
          return el.children[0].children[0].textContent;
        }
        return el.children[0].textContent;
      });

      mainData.push(HeadingArray);
      mainData.push(resultAraay);

      return mainData;
    });

    if (temp[1][0] === "Music") {
      var sss = temp[1][1];
      if (temp[1][1].indexOf("(") > 0 || temp[1][1].indexOf("-") > 0) {
        sss = temp[1][1].slice(0, temp[1][1].indexOf("("));
        sss = sss.slice(0, sss.indexOf("-"));
      }

      songData["Track"] = sss;

      songData["Artist"] = temp[1][2];
    }

    result.push({ ...songData });
    await page[i].close();
  }
  await browser.close();

  return result;
};
// (async () => {
//   // "https://www.youtube.com/watch?v=SlPhMPnQ58k",
//   const a = await getTrackName([
//     "https://www.youtube.com/watch?v=aJOTlE1K90k",
//     "https://www.youtube.com/watch?v=hVCYwwFwGEE",
//     "https://www.youtube.com/watch?v=RgKAFK5djSk"
//   ]);

// console.log(a);
// })();
