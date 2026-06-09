import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.API_KEY;
import express from "express";
// import { getChannelVideos } from "./services/youtube.js";
import YoutubeAPI from "./services/youtube.js";
import { detectCollaborators } from "./services/featDetector.js";
import { buildGraph } from "./graph/graphBuilder.js";

const app = express();

app.use(express.static("public"));

app.get("/api/graph", async (req, res) => {
    try {


        res.json(await f());
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: err.message
        });
    }
});

var f = async () => {

    try {

        const set_channels = new Set()
        set_channels.add("UCDPK_MTu3uTUFJXRVcTJcEw")
        const channels_id = ["UCDPK_MTu3uTUFJXRVcTJcEw"]
        const channels_name = ["mcfly et carlito"]
        const collaborations = [];
        for (let i = 0; i < channels_id.length && i < 10; i++) {


            const data_videos = await YoutubeAPI.get_all_descrition_title_by_id_chanel(channels_id[i])// await getChannelVideos(channelId);
            
            for (const video of data_videos) {
                const guests = detectCollaborators(
                    video.title,
                    video.description
                );

                for( const name of guests) {
                    const id_chanel = await YoutubeAPI.get_chanel_id_from_handel(name)

                    if (id_chanel == null || id_chanel in set_channels) {
                        continue
                    }
                    set_channels.add(id_chanel)
                    channels_id.push(id_chanel)
                    channels_name.push(name)
                    collaborations.push({
                        owner: channels_name[i],
                        guest: name,
                        // video
                    });
                }

            }
        }

        const graph = buildGraph(collaborations);

        return graph

    } catch (err) {
        console.error(err);

    }
}

// f()

app.listen(3000, () => {
    console.log("http://localhost:3000");
});