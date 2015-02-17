var config = require('../../config/config');
var mailin = require('mailin');
var path           = require('path');
var postmark       = require('postmark')(config.postmark.apiKey);

exports.sendBud = function *(fromUser, to, bud) {
  postmark.send({
    From: fromLine,
    To: to,
    Subject: bud.title,
    HtmlBody: bud.content,
    TextBody: bud.content
  }, function(err, response) {
    if (err) {
      console.log(err.status);
      console.log(err.message);
    } else {
      console.log(response);
    }
  });
}

exports.init = function () {
  console.log('[QIBUD] EMAILS SERVICE START...');
  mailin.start(config.mailin);

  /* Access simplesmtp server instance. */
  mailin.on('authorizeUser', function(connection, username, password, done) {
    if (username == "admin" && password == "admin") {
      done(null, true);
    } else {
      done(new Error("Unauthorized!"), false);
    }
  });

  /* Event emitted when a connection with the Mailin smtp server is initiated. */
  mailin.on('startMessage', function (connection) {
    /* connection = {
        from: 'sender@somedomain.com',
        to: 'someaddress@yourdomain.com',
        id: 't84h5ugf',
        authentication: { username: null, authenticated: false, status: 'NORMAL' }
      }
    }; */
    console.log(connection);
  });

  /* Event emitted after a message was received and parsed. */
  mailin.on('message', function (connection, data, content) {
    console.log(data);
    /* Do something useful with the parsed message here.
     * Use parsed message `data` directly or use raw message `content`. */
  });
}
