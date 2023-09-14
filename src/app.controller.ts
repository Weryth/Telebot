import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import * as fs from 'fs';
import { exec } from 'child_process';


@Controller("test")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("createbot")
  createBotFile(@Body() data: { filename: string; bottoken: string; messageforstart: string; messageforcommand: string}){
    const fileContent = `
    const { Telegraf } = require('telegraf');


    const botToken = '${data.bottoken}';
    const bot = new Telegraf(botToken);
    
    bot.start((ctx) => {
        ctx.reply('${data.messageforstart}');
    });
    
    bot.command('send', (ctx) => {
    
        
        const message = '${data.messageforcommand}';
    
        ctx.reply(message);
    });
    
    bot.launch();
    `;

    const dockerFile = `
    FROM node:20.5.1
    WORKDIR /app
    COPY package.json package-lock.json /app/
    COPY ${data.filename} /app/
    RUN npm install Telegraf
    CMD ["node", "${data.filename}.js"]
    `

    fs.mkdir(`src/bots/${data.filename}`, err=>{
      if(err){
        return err;
      }
    })
    const filePath = `src/bots/${data.filename}/${data.filename}.js`;
    
    fs.writeFile(filePath, fileContent, (err) => {
      if (err) {
        console.error('Ошибка при создании файла:', err);
      } else {
        console.log('Файл успешно создан:', filePath);
      }
    });
    try{
      const command = `node ${filePath}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Ошибка выполнения команды: ${error}`);
          return;
        }
        console.log(`Вывод команды: ${stdout}`);
      });
    }catch(ex){
      return ex;
    }
  }
}
