import 'dotenv/config';
import axios from 'axios';

export const searchFn = async (pages: any = 1, query: string) => {
  let arr: any = [];
  for (let i = 1; i <= pages; i++) {
    ('');
    await axios
      .get(
        `${process.env.MOVIEDB_URL}search/multi/?api_key=${process.env.MOVIE_API}&page=${i}&query=${query}&include_adult=false`,
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
