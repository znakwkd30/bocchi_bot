import { Controller } from '@nestjs/common';
import { Message } from 'nestjs-slack-bolt';
import { SlackEventMiddlewareArgs } from '@slack/bolt';

@Controller()
export class CommandController {
  private readonly commands: string[];

  constructor() {
    this.commands = [
      '!히라가나',
      '!가타카나',
      '!정산',
      '!애니',
      '!인기(실시간)',
      '!인기(이번주)',
      '!인기(분기)',
      '!인기(역대)',
      '!상태',
      '!디데이'
    ];
  }

  @Message('!명령어')
  async allCommands({ say }: SlackEventMiddlewareArgs) {
    await say(this.commands.toString().replace(/,/gi, ' '));
  }
}
