import {CronJob, asCronJob} from '@loopback/cron';
import axios from 'axios';
import fs from 'fs';


import {ApplicationConfig, TodoListApplication} from './application';
export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new TodoListApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);


  //start of cron job :

  const job = new CronJob({
    cronTime: '0 1 * * *',// this means the task will be ran evey 1a.m
    onTick: async () => {
      const date = new Date().toISOString().slice(0, 10);
      const fileName = `C:\\Users\\MSADDAK\\Desktop\\todo-list\\result-json\\${date}.json`;

      try {
        const responseFromAPI = await axios.get('https://soccerway-feed.p.rapidapi.com/v1/matches/list', {
          params: {
            date,
            add_live: 'true',
          },
          headers: {
            'X-RapidAPI-Key': '8aaa2c8a3cmsh2a628749c76e193p15a7a1jsncdb3f3501ef8',
            'X-RapidAPI-Host': 'soccerway-feed.p.rapidapi.com',
          },
        });

        fs.writeFile(fileName, JSON.stringify(responseFromAPI.data), (err) => {
          if (err) throw err;
          console.log(`The response has been saved to ${fileName}`);
        });
      } catch (error) {
        console.error(error);
      }
    },
    start: true,
    //timeZone: 'UTC',
  });

  job.start();


  const job2 = new CronJob({
    cronTime: '0 1 * * *',//this task will create the file {{Date}}+result.json every period mentioned in the cronTime
    onTick: async () => {
      const date = new Date().toISOString().slice(0, 10);
      const fileName = `C:\\Users\\MSADDAK\\Desktop\\todo-list\\result-json\\${date}` + `result.json`;

      try {
        const responseFromAPI = await axios.get('https://soccerway-feed.p.rapidapi.com/v1/matches/list', {
          params: {
            date,
            add_live: 'true',
          },
          headers: {
            'X-RapidAPI-Key': '8aaa2c8a3cmsh2a628749c76e193p15a7a1jsncdb3f3501ef8',
            'X-RapidAPI-Host': 'soccerway-feed.p.rapidapi.com',
          },
        });

        fs.writeFile(fileName, JSON.stringify(responseFromAPI.data), (err) => {
          if (err) throw err;
          console.log(`The response has been saved to ${fileName}`);
        });
      } catch (error) {
        console.error(error);
      }
    },
    start: true,
    //timeZone: 'UTC',
  });

  job2.start();

  //!!!!!!!!!!!! job and job2 (two crons one starts at 1a.m and the other starts at 23pm one to get the matches and the other is used to get all the results


  // Bind the cron job as an extension for the scheduler
  app.bind('cron.jobs.job1').to(job).apply(asCronJob);
  app.bind('cron.jobs.job2').to(job2).apply(asCronJob);

  // this is the end of cron code ^_^

  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 10000, // 10 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
