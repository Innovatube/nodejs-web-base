Nexty project deploy to ec2

## Get Started
### 1. Prerequisites

- [NodeJs](https://nodejs.org/en/)
- [NPM](https://npmjs.org/) - Node package manager
- MySql version 6 or height

### 2. Installation

On the command prompt run the following commands:
```
1.Upload project to ec2 server
2.Install nodejs https://nodejs.org/en/download/package-manager/#enterprise-linux-and-fedora version 8
3.Install mysql https://www.linode.com/docs/databases/mysql/how-to-install-mysql-on-centos-7/ (if use https://aws.amazon.com/rds/ don't do this)
```
Then run command
 ```
 $ npm install
 $ cp .env.example .env (edit it with your secret key and database information)
 $ npm run build (For production)
 $ ./node_modules/.bin/sequelize db:migrate (For migrate database)
 $ ./node_modules/.bin/sequelize db:seed:all (For create data fake)
 $ npm run start:prod
 $ mkdir uploads
 $ mkdir public/uploads
```
Install nginx
```
http://www.nikola-breznjak.com/blog/javascript/nodejs/using-nginx-as-a-reverse-proxy-in-front-of-your-node-js-application/
```
Change 
```
change proxy_pass http://127.0.0.1:1337; to proxy_pass http://127.0.0.1:3000; in /etc/nginx/sites-available/default
```

if want stop server nodejs 
```
$ ./node_modules/pm2/bin/pm2 kill
```
if want resart server nodejs 
```
$ ./node_modules/pm2/bin/pm2 restart 0
```
