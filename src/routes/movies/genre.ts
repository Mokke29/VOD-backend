import 'dotenv/config';
import axios from 'axios';

export const genreFn = async (
  type: string | undefined = 'movie',
  pages: any = 1,
  genres: any
) => {
  let arr: any = [];
  for (let i = 1; i <= pages; i++) {
    await axios
      .get(
        `${process.env.MOVIEDB_URL}discover/${type}/?api_key=${
          process.env.MOVIE_API
        }&page=${i}&with_genres=${genres.join(',')}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res: any) => {
        arr.push(res.data);
      });
  }

  return arr;
};
