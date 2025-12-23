import type { Response } from 'express';
import type { GraphQLParams, UserProfileResponse } from '../types';

const fetchUserProfile = async (
  res: Response,
  query: string,
  params: GraphQLParams,
  formatFunction: (data: UserProfileResponse) => unknown,
) => {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({
        query: query,
        variables: params,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    }
    if (result.errors) {
      return res.send(result);
    }
    res.setHeader('Cache-Control', 'public, max-age=900, s-maxage=900, stale-while-revalidate=3600');
    return res.json(formatFunction(result.data));
  } catch (err) {
    console.error('Error: ', err);
    return res.send(err);
  }
};

export default fetchUserProfile;
