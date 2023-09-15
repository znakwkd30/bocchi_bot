import axios from 'axios';
import { Controller } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { SlackService } from 'nestjs-slack-bolt/dist/services/slack.service';

@Controller()
export class FamousSayingController {
  constructor(private readonly slackService: SlackService) {}

  @Cron('0 0 17 * * 1-5')
  async famous() {
    const result = await axios.get(
      'https://meigen.doodlenote.net/api/json.php',
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const { meigen, auther } = result.data[0];

    await this.slackService.client.chat.postMessage({
      channel: process.env.SLACK_CHANNEL,
      text: `오늘의 문장: ${meigen}, 작성자: ${auther}`
    });
  }
}
