var podcastFeedReader = require("podcast-feed")
const fs = require('fs').promises;
const {promisify} = require('util');

const run = async xmlFilePath => {
    try {
        const xmlFeedContent = await fs.readFile(xmlFilePath, 'utf-8');
        const template = await fs.readFile('./post.template', 'utf-8');
        podcastFeedReader.parseBody('any', xmlFeedContent, podcast => {
            podcast.episodes.forEach(episode => {
                const fileName = episode.title[0].replace(" ", "-") + ".md";
                const exists = fs.exists(fileName);
                if (exists) {
                    console.log(`${fileName} already exists`);
                } else {
                    const content = template
                    .replace("$Date", episode.date)
                    .replace("$Title", episode.title[0])
                    .replace("$Description", episode.description)
                    .replace("$Cover", episode.image)
                    .replace("$AudioUrl", episode.audio);
                    await fs.writeFile(fileName, content);
                    console.log(`${fileName} generated`)
                }
            });
        });
    } catch (err) {
        console.error(err);
    }
};

run('./feed.xml');