# audio-chat
Draft audio chat backend

## first start
- copy .env.example -> .env and change the default settings if needed
- `npm run dc:up`
- go to [your mongo-express url](http://localhost:8082/ "default mongo-express url")
- in admin panel create new db voice-chat
- restart services `npm run dc:stop && npm run dc:up`
- remove services `npm run dc:remove`


you can find another commands in package.json
