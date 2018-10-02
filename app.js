"use strict";

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const request = require("request");
const path = require("path");
const fr = require('face-recognition');
const fs = require("fs");

console.log("started");

client.on("ready", () => {
  console.log(
    `Bot has started, with ${client.users.size} users, in ${
      client.channels.size
    } channels of ${client.guilds.size} guilds.`
  );

  client.user.setActivity(``);
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  let searchString = message.content.toLowerCase();
  console.log(message);
  let Attachment = message.attachments;
  let attachURL;
  Attachment.forEach(function (attachment) {
    console.log(attachment.url);
    attachURL = attachment.url;
  })

  if (attachURL != null || attachURL != undefined) {
    if (searchString.search("age") != -1 || searchString.search("location") != -1 || searchString.search("gender") != -1) { //check to see if more than name is given
      var download = function (uri, filename, callback) {
        request.head(uri, function (err, res, body) {
          console.log('content-type:', res.headers['content-type']);
          console.log('content-length:', res.headers['content-length']);

          request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
        });
      };
      download(attachURL, 'pic.png', function () {
        console.log('downloading done');
        const image = fr.loadImage("./pic.png");
        console.log("starting face detection");
        const detector = fr.AsyncFaceDetector();

        detector.locateFaces(image)
          .then((faceRectangles) => {
            console.log("found face rectangles", faceRectangles);
            console.log(faceRectangles);
            if (faceRectangles[0] == null) {
              message.member.addRole('role id') //add basic role if no face
                .then(console.log("added role id ***"), message.member.removeRole('role id') //remove beginning role
                  .then(console.log("removed role id ***"))
                  .catch(console.error)
                )
                .catch(console.error);
            } else if (faceRectangles[0].confidence < .7) {
              message.member.addRole('role id') //add basic role if no face
                .then(console.log("added added role id ***"), message.member.removeRole('role id') //remove beginning role
                  .then(console.log("removed role id ***"))
                  .catch(console.error)
                )
                .catch(console.error);
            } else {
              message.member.addRole('role id') //add image rank role if face found
                .then(console.log("added role id ***"), message.member.removeRole('role id') //remove beginning role
                  .then(console.log("removed role id ***"))
                  .catch(console.error)
                )
                .catch(console.error);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      });
    };
  } else {
    if (searchString.search("age") != -1 || searchString.search("location") != -1 || searchString.search("gender") != -1) { //check to see if more than just name is given
      message.member.addRole('role id') //add basic role
        .then(console.log("added role id ***"), message.member.removeRole('role id') //remove beginning role
          .then(console.log("removed role id ***"))
          .catch(console.error)
        )
        .catch(console.error);
    }
  }
});
client.login(config.token);