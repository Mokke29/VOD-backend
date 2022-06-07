import 'dotenv/config';
import axios from 'axios';

export const trendingFn = async (
  type: string | undefined,
  pages: any = 1,
  time = 'week'
) => {
  let arr: any = [];
  for (let i = 1; i <= pages; i++) {
    await axios
      .get(
        `
      ${process.env.MOVIEDB_URL}trending/${type}/${time}?api_key=${process.env.MOVIE_API}&page=${i}&with_genres=27`,
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
