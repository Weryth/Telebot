import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  sendMessage(){
    var bot = new Telegraf(process.env.BOT_TOKEN);
    
  }
}
