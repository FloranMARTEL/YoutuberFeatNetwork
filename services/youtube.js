import dotenv from "dotenv";
dotenv.config();

import { google } from "googleapis";

const BaseURL = "https://www.googleapis.com/youtube/v3/"
const KEY = `key=${process.env.GoogleAPIKey}`

// export async function getChannelVideos(channelId) {
//   const url = `https://www.googleapis.com/youtube/v3/search?${KEY}&channelId=${channelId}&part=snippet&order=date&maxResults=50&type=video`;

//   const res = await fetch(url);
//   const data = await res.json();
//   console.log("data")
//   console.log(data)
//   debugger
//   return data.items.map(item => ({
//     videoId: item.id.videoId,
//     title: item.snippet.title,
//     description: item.snippet.description,
//     channelTitle: item.snippet.channelTitle
//   }));
// }


export default class YoutubeAPI {

  static async get_all_descrition_title_by_id_chanel(id_chanel) {

    // id_chanel = "UCDPK_MTu3uTUFJXRVcTJcEw"
    const responce = await fetch(`${BaseURL}channels?${KEY}&part=contentDetails&id=${id_chanel}`)

    const data = await responce.json()
    if (data.items == undefined){
      console.log(data)
      return []
    }
    const upload_id = data.items[0].contentDetails.relatedPlaylists.uploads

    return await YoutubeAPI.get_all_descrition_title_from_upload_playlist(upload_id)

  }

  static async get_all_descrition_title_from_upload_playlist(upload_id) {

    let next_page = null

    const datas = []
    let cpt = 0
    const limite = 5
    do {

      const responce = await fetch(`${BaseURL}playlistItems?${KEY}&part=snippet&playlistId=${upload_id}&maxResults=50` + ((next_page == null) ? "" : `&pageToken=${next_page}`))
      const data = await responce.json()

      const data_maped = []


      if (data.items == undefined){
        console.log(data)
        return []
      }

      data.items.forEach(element => {
        if (cpt > limite) {
          return
        }

        const video_id = element.snippet.resourceId.videoId
        const title = element.snippet.title
        const description = element.snippet.description

        data_maped.push({ video_id, title, description })
      });

      const videos_detail = await YoutubeAPI.get_all_videos_detail(data_maped.map((elem) => elem.video_id))

      const data_filtred = data_maped.filter((elem, index) => {
        if (videos_detail[index] == undefined){
          return false
        }
        
        return duration_to_seconds(videos_detail[index].contentDetails.duration) > 3 * 60
      })

      datas.push(...data_filtred)

      cpt++
      next_page = data.nextPageToken
    } while (next_page != null && cpt < limite)

    return datas
  }

  static async get_all_videos_detail(video_id) {

    const str_video_id = video_id.join(",")

    const responce = await fetch(`${BaseURL}videos?${KEY}&part=contentDetails&id=${str_video_id}`)
    const data = await responce.json()

    if (data.items == undefined){
      return []
    }

    return data.items

  }


  static async get_chanel_id_from_handel(handle) {

    const responce = await fetch(`${BaseURL}channels?${KEY}&part=id&forHandle=${handle}`)
    const data = await responce.json()

    if (data.items == undefined) {
      return null
    }


    return data.items[0].id || null

  }
}


function duration_to_seconds(duration) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (match==null){
    return 0
  }

  const seconds =
    (parseInt(match[1] || 0) * 3600) +
    (parseInt(match[2] || 0) * 60) +
    parseInt(match[3] || 0);

  return seconds;
}