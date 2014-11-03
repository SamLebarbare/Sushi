var config = require('../../config/config');
var mailin = require('mailin');

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
