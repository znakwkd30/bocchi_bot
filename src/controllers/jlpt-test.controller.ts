import { Controller } from '@nestjs/common';
import { Message } from 'nestjs-slack-bolt';
import { SlackEventMiddlewareArgs } from '@slack/bolt';

@Controller()
export class JlptTestController {
  private readonly testday: string;

  constructor() {
    this.testday = '20231203';
  }

  @Message('!디데이' || '!시험')
  async dDday({ say }: SlackEventMiddlewareArgs) {
    const today = new Date();
    const targetDate = new Date(this.testday);
    const difference = targetDate.getTime() - today.getTime();
    const dday = Math.floor(difference / (1000 * 60 * 60 * 24));
    await say(
      `2023년도 제 2회 JLPT 시험일 12월 3일(일요일) 까지 ${dday}일 남았습니다.`
    );
  }
}
