import { Controller } from '@nestjs/common';
import { Message } from 'nestjs-slack-bolt';
import { SlackEventMiddlewareArgs } from '@slack/bolt';

@Controller()
export class HealthController {
  private readonly dialogues = [];

  constructor() {
    this.dialogues = [
      '저, 저는··· 기타리스트로서 모두의 소중한 결속 밴드를 최고의 밴드로 만들고 싶어요.',
      '호... 혹시 모르니 만들지 않으실래요? 테루테루보즈..',
      '존나 못 쳐서 죄송합니다앍!!!',
      ':bocchi:',
      ':bocchi-panic:',
      ':bocchi-panic2:',
      ':bocchi-panic3:'
    ];
  }

  @Message('!상태')
  async health({ say }: SlackEventMiddlewareArgs) {
    await say(
      this.dialogues[Math.floor(Math.random() * this.dialogues.length)]
    );
  }
}
