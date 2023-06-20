import '../dotenv.js';
import { db } from '../connect.js';
import { recomUserQuery } from '../db/socialQueries.js';
import { tagQuery } from '../db/socialQueries.js';
import { profileQuery } from '../db/socialQueries.js';
import { followCheckQuery } from '../db/followQueries.js';

export const recomUsers = async (req, res) => {
  const { user } = res.locals;
  const userId = user.user_id;

  let connection = null;
  try {
    connection = await db.getConnection();
    const [recommendList] = await connection.query(recomUserQuery, [userId, userId]);
    // console.log(recommendList);

    /* 최종 리턴 */
    let data =[];

    /* 한 유저당 */
    for (const user of recommendList) {
      const recomUser = user.user_id;
      /* tag */
      let tags = [];
      const [tagList] = await connection.query(tagQuery, recomUser);
      for (const item of tagList) {
        tags.push(item.tag);
      }

      /* user profile - name, img */
      const [profile] = await connection.query(profileQuery, recomUser);
      const [checkFollow] = await connection.query(followCheckQuery, [userId, recomUser]);
      const isFriend = checkFollow[0].count > 0 ? true : false;

      const userProfile = {
        userId: recomUser,
        img: profile[0].profile_img,
        userName: profile[0].user_name,
        tags: tags,
        isFriend: isFriend,
      };

      data.push(userProfile);
    }
    connection.release();
    res.status(200).send(data);  
  } catch (err) {
    connection?.release();
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};