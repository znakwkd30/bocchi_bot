import axios from 'axios';
import { Message } from 'nestjs-slack-bolt';
import { Controller } from '@nestjs/common';
import { SayFn, SlackEventMiddlewareArgs } from '@slack/bolt';

@Controller()
export class LaftelController {
  @Message('!애니')
  async animeRank({ say }: SlackEventMiddlewareArgs) {
    // 2023-09-15 기준 max
    const max = Math.floor(Math.random() * 2764);
    const result = await axios.get(
      `https://laftel.net/api/search/v1/discover/?sort=rank&viewable=true&offset=${max}&size=60`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const anime =
      result.data.results[
        Math.floor(Math.random() * result.data.results.length)
      ];

    await say({
      text: `${anime.name} [${anime.genres}]`,
      attachments: [
        {
          text: `썸네일`,
          image_url: anime.img
        }
      ]
    });
  }

  @Message('!인기(실시간)')
  async anime4hour({ say }: SlackEventMiddlewareArgs) {
    return await this.crawlAnimeAndSay(say, '4hour');
  }

  @Message('!인기(이번주)')
  async animeWeek({ say }: SlackEventMiddlewareArgs) {
    return await this.crawlAnimeAndSay(say, 'week');
  }

  @Message('!인기(분기)')
  async animeQuarter({ say }: SlackEventMiddlewareArgs) {
    return await this.crawlAnimeAndSay(say, 'quarter');
  }

  @Message('!인기(역대)')
  async animeHistory({ say }: SlackEventMiddlewareArgs) {
    return await this.crawlAnimeAndSay(say, 'history');
  }

  private async crawlAnimeAndSay(say: SayFn, type: string) {
    const result = await axios.get(
      `https://laftel.net/api/home/v1/recommend/ranking/?type=${type}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    for (let i = 0; i <= result.data.length; i++) {
      const anime = result.data[i];

      await say({
        text: `${i + 1}. ${anime.name} [${anime.genres}]`
      });
    }

    return;
  }
}
