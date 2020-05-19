var podcastFeedReader = require("podcast-feed");
const fsPromises = require("fs").promises;
const fs = require("fs");
const { promisify } = require("util");

const run = async (xmlFilePath) => {
  try {
    const xmlFeedContent = await fsPromises.readFile(xmlFilePath, "utf-8");
    const template = await fsPromises.readFile("./post.template", "utf-8");

    const podcast = await parseFeed(xmlFeedContent);
    const episodes = podcast.episodes;

    const posts = episodes.map((episode) => ({
      fileName: episode.title[0].replace(/\s/g, "-") + ".md",
      content: template
        .replace(/\$Date/g, episode.date)
        .replace(/\$Title/g, episode.title[0])
        .replace(/\$Description/g, episode.description)
        .replace(/\$Cover/g, episode.image)
        .replace(/\$AudioUrl/g, episode.audio),
    }));

    for (let x = 0; x < posts.length; x++) {
      const post = posts[x];
      const exists = fs.existsSync(post.fileName);
      if (exists) {
        console.log(`${post.fileName} already exists`);
      } else {
        await fsPromises.writeFile(post.fileName, post.content);
        console.log(`${post.fileName} generated`);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

const parseFeed = (xmlFeedContent) =>
  new Promise((resolve, reject) => {
    podcastFeedReader.parseBody("any", xmlFeedContent, (podcast) => {
      resolve(podcast);
    });
  });

run("./feed.xml");
