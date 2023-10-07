import React from 'react';
import { RssFeedFetchResponse } from '../../types/rssFeed';

const newsEntries: RssFeedFetchResponse = [
  {
    title: "Cats are actually radioactive",
    link: "https://www.google.com",
    description: "Cats are actually radioactive",
    published: 'Thu, 05 Sep 2002 00:00:01 GMT',
    tags: [
      "cats",
      "radioactive",
      "insane"
    ]
  }
]

const NewsPage = () => {
  return (
    <div>
      {/* 最新ニュースページのコンテンツをここに追加 */}
    </div>
  );
};

export default NewsPage;
