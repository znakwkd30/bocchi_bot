import Redis from 'ioredis';
import { Controller } from '@nestjs/common';
import { Message } from 'nestjs-slack-bolt';
import { SlackEventMiddlewareArgs } from '@slack/bolt';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

@Controller()
export class StudyController {
  private studies: Record<string, string>;

  constructor(
    @InjectRedis()
    private readonly redis: Redis
  ) {}

  @OnEvent('load_study', { async: true })
  async loadStudy() {
    try {
      this.studies = await this.redis.hgetall('studies');
    } catch (err) {
      console.log(`redis load error ${err.message}`);
    }
  }

  @Message('pencil2')
  async study({ say, message }: SlackEventMiddlewareArgs) {
    const text = message['text'] as string;
    const date = text.match(
      /\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])/gi
    )[0];

    if (this.studies[message['user']]) {
      const studyData = JSON.parse(this.studies[message['user']]);

      const isAlreadyStudyDate =
        studyData.studyDate.filter((studyDay) => {
          if (studyDay === date) {
            return studyDay;
          }
        }).length > 0;

      if (isAlreadyStudyDate) {
        say(
          `<@${message['user']}> 今日の勉強もお疲れ様でした。 ${studyData.studyDate.length}일째`
        );
      } else {
        studyData.studyDate.push(date);
        studyData.continuousDate = studyData.continuousDate + 1;

        this.studies[message['user']] = JSON.stringify({
          studyDate: studyData.studyDate,
          lastStudyDate: date,
          continuousDate: studyData.continuousDate
        });

        await this.redis.del('studies');
        await this.redis.hset('studies', this.studies);

        say(
          `<@${message['user']}> 今日の勉強もお疲れ様でした。 ${studyData.studyDate.length}일째`
        );
      }
    } else {
      this.studies[message['user']] = JSON.stringify({
        studyDate: [date],
        lastStudyDate: date,
        continuousDate: 1
      });

      await this.redis.hset('studies', this.studies);

      say(`<@${message['user']}> 今日の勉強もお疲れ様でした。 1일째`);
    }
  }

  @Message('!정산')
  async totalStudies({ say, message }: SlackEventMiddlewareArgs) {
    if (this.studies[message['user']]) {
      //TODO: 등수까지 확인 가능하게 수정
      const studyData = JSON.parse(this.studies[message['user']]);

      say(`${studyData.studyDate.length}日勉強したよ！ これからも頑張ってね`);
    } else {
      say('勉強したことがない。 早く勉強して');
    }
  }
}
