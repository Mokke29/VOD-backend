import 'dotenv/config';
import { Response, Router, RequestExtended } from 'express';
import axios from 'axios';
import { trendingFn } from './trending';
import { genreFn } from './genre';
import { searchFn } from './search';

const router = Router();

interface Poster {
  poster_path: string;
}
//Movies API
router.post('/', (req: RequestExtended, res: Response) => {
  axios
    .get(
      `
      https://api.themoviedb.org/3/tv/1429/videos?api_key=${process.env.MOVIE_API}&language=en-US`,
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )
    .then((res: any) => {
      console.log(res.data.results);
      console.log('https://image.tmdb.org/t/p/original' + res.data.poster_path);
    });
});

router.post('/trends', async (req: RequestExtended, res: Response) => {
  let { type, pages, time } = req.body;
  let trends = await trendingFn(type, pages, time);
  res.send(trends);
});
router.post('/details', async (req: RequestExtended, res: Response) => {
  let { type, id } = req.body;
  let response = await axios.get(
    `${process.env.MOVIEDB_URL}${type}/${id}?api_key=${process.env.MOVIE_API}`,
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );
  res.send(response.data);
});

router.post('/genres', async (req: RequestExtended, res: Response) => {
  let { type, pages, genres } = req.body;
  if (genres!.length > 0) {
    let genre = await genreFn(type, pages, genres);
    res.send(genre);
  } else {
    res.send('Failed genres arr is empty.');
  }
});

router.post('/search', async (req: RequestExtended, res: Response) => {
  let { pages, query } = req.body;
  if (query) {
    let search = await searchFn(pages, query);
    res.send(search);
  } else {
    res.send('Failed genres arr is empty.');
  }
});

export { router as moviesRoutes };
