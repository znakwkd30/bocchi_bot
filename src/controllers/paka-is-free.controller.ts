import { Controller } from '@nestjs/common';
import { Message } from 'nestjs-slack-bolt';
import { SlackEventMiddlewareArgs } from '@slack/bolt';
import {DateTime} from "luxon";

@Controller()
export class PakaIsFreeController {
  private readonly theDayOfFreedom: string;

  constructor() {
    this.theDayOfFreedom = '20251104';
  }

  @Message('!파카')
  async dDday({ say }: SlackEventMiddlewareArgs) {
    const dday = Math.ceil(
      DateTime.fromISO(this.theDayOfFreedom)
        .diff(DateTime.local())
        .get('milliseconds') /
        (1000 * 60 * 60 * 24)
    );
    await say(
      `파카의 전역일인 2025년 11월 4일까지 ${dday}일 남았습니다.:경례를_하는_얼굴:`
    );
  }
}
