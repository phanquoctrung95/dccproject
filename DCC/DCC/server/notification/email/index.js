var fs = require('fs');
var settings;
if (fs.existsSync('settings.js') == true)
  settings = require('../../../settings.js');
else
  settings = require('../../../settingsDefault.js');
var email_config = settings.email;
var email_auth = settings.auth;
var email_smtp = settings.smtp;
const nodemailer = require('nodemailer');
const crypto = require('crypto');
var models = require('../../models');
var email_host = settings.host;

function createSmtp() {
  return nodemailer.createTransport({
    host: email_smtp.host,
    port: email_smtp.port,
    secure: email_smtp.secure, // true for 465, false for other ports
    auth: {
      user: email_smtp.user, // generated ethereal user
      pass: email_smtp.pass // generated ethereal password
    }
  });
};

function createOAuth2() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: email_config.USER_EMAIL,
      clientId: email_config.USER_CLIENT_ID,
      clientSecret: email_config.USER_CLIENT_SECRET,
      refreshToken: email_config.USER_REFRESH_TOKEN,
      accessToken: email_config.USER_ACCESS_TOKEN,
    }
  });
};
var transporter = email_auth === 'smtp' ? createSmtp() : createOAuth2();

function formatDate(date) {
  date = new Date(date);
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var hours = date.getHours();
  var minutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();

  return day + ' ' + monthNames[monthIndex] + ' ' + year + ', ' + hours + ':' + minutes;
}

var email = {
  send: function (receivers = [], subject, content, flag = 0) {
    // var fs = require('fs');
    // var style = fs.readFileSync(__dirname + '/styles.css','utf8');
    //ip 192.168.122.20 là ip của server ( địa chỉ ip này nên lưu vào 1 biến )
    var sign = {
      website: "http://192.168.122.20",
    };
    var hrefYes = sign.website + "/#/login_user/confirm?cofirm=YES&classId=" + content.classID;
    var hrefNo = sign.website + "/#/login_user/confirm?cofirm=NO&classId=" + content.classID;

    var mailOptions;
    if (flag === 1) { //0: default mail
      //1: notify class information
      //2: mail for recovery password
      //3: mail for register account
      //4: notify edit class information clearly
      //5: remove trainee
      //6: notify canceled class
      // xu ly
      for (var i = 0; i < receivers.length; i++) {
        var hash = crypto.randomBytes(100).toString('hex');
        mailOptions = {
          from: 'DEK Competence Center <dektech.dcc@gmail.com>',
          to: receivers[i].toString(),
          subject: `[Training] ${subject}`,
          html: `   
                    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
                    <html xmlns="http://www.w3.org/1999/xhtml">
                      <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                        <meta name="viewport" content="width=device-width">
                        <title>Title</title>
                      </head>
                      <body>
                        <table class="body" data-made-with-foundation="">
                          <tr>
                            <td class="float-center" align="center" valign="top">
                              <center data-parsed="">
                                <table align="center" class="container header float-center">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table class="row">
                                          <tbody>
                                            <tr>
                                              <th class="small-12 large-12 columns first last">
                                                <table>
                                                  <tr>
                                                    <th>
                                                      <h2 class="text-center" style="padding-top:10px;">You have been added to class</h2>
                                                      <center data-parsed="">
                                                      </center>
                                                    </th>
                                                  </tr>
                                                </table>
                                              </th>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table align="center" class="container body-border float-center" style="border-top: 8px solid #663399">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table class="row">
                                          <tbody>
                                            <tr>
                                              <th class="small-12 large-12 columns first last">
                                                <table>
                                                  <tr>
                                                    <th>
                                                      <table class="spacer">
                                                        <tbody>
                                                          <tr>
                                                            <td height="10px" style="font-size:10px;line-height:10px;">&#xA0;</td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                      <center data-parsed=""> <img src="http://sv1.upsieutoc.com/2017/11/01/DCC-icon.png" width="176" height="100" align="center" class="float-center" style="margin-top:5px; margin-bottom:5px"> </center>
                                                      <h2>${subject}</h2>
                                                      <table style="width: 100%; margin: 15px 0 5px 0; height: 135px; overflow: hidden; text-overflow: ellipsis; font-size: 14px; family-font: Times New Roman; text-align:left;">
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">Start Time: </td>
                                                            <td style="vertical-align:top">${(formatDate(content.startTime))}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">End Time: </td>
                                                            <td style="vertical-align:top">${(formatDate(content.endTime))}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">Location: </td>
                                                            <td style="vertical-align:top">${(content.location)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">Trainer: </td>
                                                            <td style="vertical-align:top">${(content.trainer)}</td>
                                                        </tr>
                                                    </table>
                                                  <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; text-align: left">
                                                    <p style="font-size: 25px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 5px auto;" title="Description">Description</p>
                                                    <p style="font-size: 14px; overflow: auto; padding-bottom: 10px">${content.description}</p>
                                                  </div>
                                                  <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; text-align: left; padding-top:8px">
                                                    <p style="font-size: 18px">You have yet to learn this course. Do you wish to participate? <p>
                                                    <table>
                                                        <tr>
                                                            <td style="width: 47px;background-color: #e1e8e7;border: 2px solid #616263;padding: 5px;text-align: center;">
                                                                <a href=` + hrefYes + `>Yes</a>
                                                            </td>
                                                            <td style="width: 47px;background-color: #e1e8e7;border: 2px solid #616263;padding: 5px;text-align: center;">
                                                                <a href=` + hrefNo + `>No</a>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                  </div>
                                                 </th>
                                                </tr>
                                              </table>
                                              </th>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <footer>
                                  <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; font-size:14px; text-align: left; padding-top:5px; padding-left:3px;">
                                    <p>DEK Technologies Vietnam Co. Ltd.
                                    <br>Web: ${sign.website}
                                    <br><img src="https://itviec.com/employers/dek-technologies/logo/social/dek-technologies-logo.png?e2ZfGH9EqNcBbcQ7nKUpvkEb" width="100" height="100" style="display: block;">
                                    <br><i>With offices situated in Australia, Italy, Sweden and Vietnam,
                                    <br><i>DEK Technologies is ideally placed to be your global high technology partner.
                                    </p>
                                    </div>
                                </footer>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </center>
                            </td>
                          </tr>
                        </table>
                      </body>
                    </html>
                    `,
        };
        //save status email reponse
        models.EmailResponseStatus.add(receivers[i], hash, 0, (result) => {
        });
        transporter.sendMail(mailOptions, (error, info) => {
        });
      }
    } else if (flag === 6) {
      for (var j = 0; j < receivers.length; j++) {
        var hash_s = crypto.randomBytes(100).toString('hex');
        mailOptions = {
          from: '"DEK Competence Center" <dektech.dcc@gmail.com>',
          to: receivers[j].toString(),
          subject: `[Training] ${subject}`,
          html: `
                    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
                    <html xmlns="http://www.w3.org/1999/xhtml">
                      <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                        <meta name="viewport" content="width=device-width">
                        <title>Title</title>
                      </head>
                      <body>
                        <!-- <style> -->
                        <table class="body" data-made-with-foundation="">
                          <tr>
                            <td class="float-center" align="center" valign="top">
                              <center data-parsed="">
                                <table align="center" class="container header float-center">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table class="row">
                                          <tbody>
                                            <tr>
                                              <th class="small-12 large-12 columns first last">
                                                <table>
                                                  <tr>
                                                    <th>
                                                      <h1 class="text-center" style="padding-top:10px;">Your class has been cancelled</h1>
                                                      <center data-parsed="">
                                                      </center>
                                                    </th>
                                                  </tr>
                                                </table>
                                              </th>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table align="center" class="container body-border float-center" style="border-top: 8px solid #663399">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table class="row">
                                          <tbody>
                                            <tr>
                                              <th class="small-12 large-12 columns first last">
                                                <table>
                                                  <tr>
                                                    <th>
                                                      <table class="spacer">
                                                        <tbody>
                                                          <tr>
                                                            <td height="10px" style="font-size:10px;line-height:10px;">&#xA0;</td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                      <center data-parsed=""> <img src="http://sv1.upsieutoc.com/2017/11/01/DCC-icon.png" width="176" height="100" align="center" class="float-center" style="margin-top:5px; margin-bottom:5px"> </center>
                                                      <h2>${subject}</h2>
                                                      <table style="width: 100%; margin: 15px 0 5px 0; height: 135px; overflow: hidden; text-overflow: ellipsis; font-size: 14px; family-font: Times New Roman; text-align:left;">
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">Start Time: </td>
                                                            <td style="vertical-align:top">${(formatDate(content.startTime))}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">End Time: </td>
                                                            <td style="vertical-align:top">${(formatDate(content.endTime))}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">Location: </td>
                                                            <td style="vertical-align:top">${(content.location)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">Trainer: </td>
                                                            <td style="vertical-align:top">${(content.trainer)}</td>
                                                        </tr>
                                                    </table>
                                                  <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; text-align: left">
                                                    <p style="font-size: 25px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 5px auto;" title="Description">Description</p>
                                                    <p style="font-size: 14px; overflow: auto; padding-bottom: 10px">${content.description}</p>
                                                  </div>
                                                  <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; text-align: left">
                                                    <p style="font-size: 20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;  margin: 5px auto; margin-top:7px" title="Description">Please contact your admin for more information.</p><br>
                                                  </div>
                                                    </th>
                                                    <th class="expander"></th>
                                                  </tr>
                                                </table>
                                              </th>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <footer>
                                          <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; font-size:14px; text-align: left; padding-top:5px; padding-left:3px;">
                                            <p>DEK Technologies Vietnam Co. Ltd.
                                            <br>Web: ${sign.website}
                                            <br><img src="https://itviec.com/employers/dek-technologies/logo/social/dek-technologies-logo.png?e2ZfGH9EqNcBbcQ7nKUpvkEb" width="100" height="100" style="display: block;">
                                            <br><i>With offices situated in Australia, Italy, Sweden and Vietnam,
                                            <br><i>DEK Technologies is ideally placed to be your global high technology partner.
                                            </p>
                                          </div>
                                      </footer>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </center>
                            </td>
                          </tr>
                        </table>
                      </body>
                    </html>
                    `,
        };
        //save status email reponse
        models.EmailResponseStatus.add(receivers[j], hash_s, 0, (result) => {
          console.log(result);
        });
        transporter.sendMail(mailOptions, (error, info) => {
          console.log(error, info);
        });
      }

    } else if (flag === 2) {
      mailOptions = {
        from: '"DEK Competence Center" <dektech.dcc@gmail.com>',
        to: receivers.toString(),
        subject: '[Password changed successfully]',
        html: `
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
                    <html xmlns="http://www.w3.org/1999/xhtml">
                      <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                        <meta name="viewport" content="width=device-width">
                        <title>Title</title>
                      </head>
                      <body>
                        <!-- <style> -->
                        <table class="body" data-made-with-foundation="">
                          <tr>
                            <td class="float-center" align="center" valign="top">
                              <center data-parsed="">
                                <table align="center" class="container header float-center">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table class="row">
                                          <tbody>
                                            <tr>
                                              <th class="small-12 large-12 columns first last">
                                                <table>
                                                  <tr>
                                                    <th>
                                                      <h2 class="text-center" style="padding-top:10px;">Password changed successfully</h2>
                                                      <center data-parsed="">
                                                      </center>
                                                    </th>
                                                  </tr>
                                                </table>
                                              </th>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table align="center" class="container body-border float-center" style="border-top: 8px solid #663399">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table class="row">
                                          <tbody>
                                            <tr>
                                              <th class="small-12 large-12 columns first last">
                                                <table>
                                                  <tr>
                                                    <th>
                                                      <table class="spacer">
                                                        <tbody>
                                                          <tr>
                                                            <td height="10px" style="font-size:10px;line-height:10px;">&#xA0;</td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                      <center data-parsed=""> <img src="http://sv1.upsieutoc.com/2017/11/01/DCC-icon.png" width="176" height="100" align="center" class="float-center" style="margin-top:5px; margin-bottom:5px"> </center>
                                                      <h2>${subject}</h2>
                                                      <table style="width: 100%; margin: 15px 0 5px 0; height: 135px; overflow: hidden; text-overflow: ellipsis; font-size: 14px; family-font: Times New Roman; text-align:left;">
                                                        <tr>
                                                            <td style="width: 30%; vertical-align:top; color: #000">Username: </td>
                                                            <td style="vertical-align:top">${content.username}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 30%; vertical-align:top; color: #000">Email: </td>
                                                            <td style="vertical-align:top">${content.email}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 30%; vertical-align:top; color: #000">New password: </td>
                                                            <td style="vertical-align:top">${content.password}</td>
                                                        </tr>
                                                    </table>
													                            <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5;">
                                                        <p style="font-size: 20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;  margin: 5px auto; padding-top: 7px" title="Description">Click <a href="http://192.168.122.20/#/home">this link</a> to return to our hompage.</p><br>
                                                      </div>
                                                    </th>
                                                    <th class="expander"></th>
                                                  </tr>
                                                </table>
                                              </th>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <footer>
                                        <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; font-size:14px; text-align: left; padding-top:5px; padding-left:3px;">
                                          <p>DEK Technologies Vietnam Co. Ltd.
                                          <br>Web: ${sign.website}
                                          <br><img src="https://itviec.com/employers/dek-technologies/logo/social/dek-technologies-logo.png?e2ZfGH9EqNcBbcQ7nKUpvkEb" width="100" height="100" style="display: block;">
                                          <br><i>With offices situated in Australia, Italy, Sweden and Vietnam,
                                          <br><i>DEK Technologies is ideally placed to be your global high technology partner.
                                          </p>
                                          </div>
                                      </footer>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </center>
                            </td>
                          </tr>
                        </table>
                      </body>
                    </html>
            `
      };
      transporter.sendMail(mailOptions, (error, info) => {
        console.log(error, info);
      });
    } else if (flag === 3) {
      mailOptions = {
        from: '"DEK Competence Center" <dektech.dcc@gmail.com>',
        to: receivers.toString(),
        subject: '[Welcome]',
        html: `
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml">
                  <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                    <meta name="viewport" content="width=device-width">
                    <title>Title</title>
                  </head>
                  <body>
                    <!-- <style> -->
                    <table class="body" data-made-with-foundation="">
                      <tr>
                        <td class="float-center" align="center" valign="top">
                          <center data-parsed="">
                            <table align="center" class="container header float-center">
                              <tbody>
                                <tr>
                                  <td>
                                    <table class="row">
                                      <tbody>
                                        <tr>
                                          <th class="small-12 large-12 columns first last">
                                            <table>
                                              <tr>
                                                <th>
                                                  <h2 class="text-center" style="padding-top:10px;">Welcome to DEK Competence Center</h2>
                                                  <center data-parsed="">
                                                  </center>
                                                </th>
                                              </tr>
                                            </table>
                                          </th>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table align="center" class="container body-border float-center" style="border-top: 8px solid #663399">
                              <tbody>
                                <tr>
                                  <td>
                                    <table class="row">
                                      <tbody>
                                        <tr>
                                          <th class="small-12 large-12 columns first last">
                                            <table>
                                              <tr>
                                                <th>
                                                  <table class="spacer">
                                                    <tbody>
                                                      <tr>
                                                        <td height="10px" style="font-size:10px;line-height:10px;">&#xA0;</td>
                                                      </tr>
                                                    </tbody>
                                                  </table>
                                                  <center data-parsed=""> <img src="http://sv1.upsieutoc.com/2017/11/01/DCC-icon.png" width="176" height="100" align="center" class="float-center" style="margin-top:5px; margin-bottom:5px"> </center>
                                                  <h2>Hello ${content.username},</h2>
                                                  <p style="font-size: 16px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;  margin: 5px auto;" title="Description">Your email and auto-generated password is following:</p>
                                                  <table style="width: 100%; margin: 15px 0 5px 0; height: 135px; overflow: hidden; text-overflow: ellipsis; font-size: 14px; family-font: Times New Roman; text-align:left;">
                                                    <tr>
                                                    <td style="width: 25%; vertical-align:top; color: #000">Email: </td>
                                                    <td style="vertical-align:top">${content.email}</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 25%; vertical-align:top; color: #000">Password: </td>
                                                    <td style="vertical-align:top">${content.password}</td>
                                                </tr>
                                                <tr>
                                                    <td style="width: 25%; vertical-align:top; color: #000">IP: </td>
                                                    <td style="vertical-align:top">http://${email_host}</td>
                                                </tr>
                                                </table>
                                                <div style="width: 100%; box-sizing: border-box; padding-bottom: 7px; padding-top:7px; border-top: 1px solid #e5e5e5;">
                                                  <p style="font-size: 18px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 5px auto;" title="Description">Should you sign in DEK DCC as the first time,</p>
                                                  <p style="font-size: 18px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 5px auto;" title="Description">please change your password to access other features.</p>
                                                </div>
                                                <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5;">
                                                  <p style="font-size: 20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;  margin: 5px auto;" title="Description">Click <a href="http://192.168.122.20/#/home">this link</a> to return to our hompage.</p><br>
                                                </div>
                                                </th>
                                                <th class="expander"></th>
                                              </tr>
                                            </table>
                                          </th>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <footer>
                                      <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; font-size:14px; text-align: left; padding-top:5px; padding-left:3px;">
                                        <p>DEK Technologies Vietnam Co. Ltd.
                                        <br>Web: ${sign.website}
                                        <br><img src="https://itviec.com/employers/dek-technologies/logo/social/dek-technologies-logo.png?e2ZfGH9EqNcBbcQ7nKUpvkEb" width="100" height="100" style="display: block;">
                                        <br><i>With offices situated in Australia, Italy, Sweden and Vietnam,
                                        <br><i>DEK Technologies is ideally placed to be your global high technology partner.
                                        </p>
                                      </div>
                                    </footer>
                                    </td>
                                </tr>
                              </tbody>
                            </table>
                          </center>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
                    `
      };
      transporter.sendMail(mailOptions, (error, info) => {
        console.log(error, info);
      });

    } else if (flag === 4) {
      for (let i = 0; i < receivers.length; i++) {
        const hash = crypto.randomBytes(100).toString('hex');
        mailOptions = {
          from: '"DEK Competence Center" <dektech.dcc@gmail.com>',
          to: receivers[i].toString(),
          subject: `[Update] ${subject}`,
          html: `
                    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
                    <html xmlns="http://www.w3.org/1999/xhtml">
                      <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                        <meta name="viewport" content="width=device-width">
                        <title>Title</title>
                      </head>
                      <body>
                        <!-- <style> -->
                        <table class="body" data-made-with-foundation="">
                          <tr>
                            <td class="float-center" align="center" valign="top">
                              <center data-parsed="">
                                <table align="center" class="container header float-center">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table class="row">
                                          <tbody>
                                            <tr>
                                              <th class="small-12 large-12 columns first last">
                                                <table>
                                                  <tr>
                                                    <th>
                                                      <h1 class="text-center" style="padding-top:10px;">Your class has been updated</h1>
                                                      <center data-parsed="">
                                                      </center>
                                                    </th>
                                                  </tr>
                                                </table>
                                              </th>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table align="center" class="container body-border float-center" style="border-top: 8px solid #663399">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table class="row">
                                          <tbody>
                                            <tr>
                                              <th class="small-12 large-12 columns first last">
                                                <table>
                                                  <tr>
                                                    <th>
                                                      <table class="spacer">
                                                        <tbody>
                                                          <tr>
                                                            <td height="10px" style="font-size:10px;line-height:10px;">&#xA0;</td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                      <center data-parsed=""> <img src="http://sv1.upsieutoc.com/2017/11/01/DCC-icon.png" width="176" height="100" align="center" class="float-center" style="margin-top:5px; margin-bottom:5px"> </center>
                                                      <h2>${subject}</h2>
                                                      <table style="width: 100%; margin: 15px 0 5px 0; height: 135px; overflow: hidden; text-overflow: ellipsis; font-size: 14px; family-font: Times New Roman; text-align:left;">
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">Start Time: </td>
                                                            <td style="vertical-align:top">${(Date.parse(content.oldStartTime) === Date.parse(content.newStartTime)) ? formatDate(content.oldStartTime) : "<strike>" + formatDate(content.oldStartTime) + "</strike>" + " --> " + formatDate(content.newStartTime)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">End Time: </td>
                                                            <td style="vertical-align:top">${(Date.parse(content.oldEndTime) === Date.parse(content.newEndTime)) ? formatDate(content.oldEndTime) : "<strike>" + formatDate(content.oldEndTime) + "</strike>" + " --> " + formatDate(content.newEndTime)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">Location: </td>
                                                            <td style="vertical-align:top">${(content.oldLocation === content.newLocation) ? content.oldLocation : "<strike>" + content.oldLocation + "</strike>" + " --> " + content.newLocation}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">Trainer: </td>
                                                            <td style="vertical-align:top">${(content.oldTrainer === content.newTrainer) ? content.oldTrainer : "<strike>" + content.oldTrainer + "</strike>" + " --> " + content.newTrainer}</td>
                                                        </tr>
                                                    </table>
                                                  <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; text-align: left">
                                                    <p style="font-size: 25px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 5px auto;" title="Description">Description</p>
                                                    <p style="font-size: 14px; overflow: auto; padding-bottom: 10px">${content.description}</p>
                                                  </div>
                                                  <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; text-align: left">
                                                    <p style="font-size: 20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;  margin: 5px auto; margin-top:7px" title="Description">Please contact your admin for more information.</p><br>
                                                  </div>
                                                    </th>
                                                    <th class="expander"></th>
                                                  </tr>
                                                </table>
                                              </th>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <footer>
                                        <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; font-size:14px; text-align: left; padding-left:3px;">
                                          <p>DEK Technologies Vietnam Co. Ltd.
                                          <br>Web: ${sign.website}
                                          <br><img src="https://itviec.com/employers/dek-technologies/logo/social/dek-technologies-logo.png?e2ZfGH9EqNcBbcQ7nKUpvkEb" width="100" height="100" style="display: block;">
                                          <br><i>With offices situated in Australia, Italy, Sweden and Vietnam,
                                          <br><i>DEK Technologies is ideally placed to be your global high technology partner.
                                          </p>
                                          </div>
                                        </footer>
                                        </td>
                                    </tr>
                                  </tbody>
                                </table> 
                              </center>
                            </td>
                          </tr>
                        </table>
                      </body>
                    </html>
                    `,
        };
        //save status email reponse
        models.EmailResponseStatus.add(receivers[i], hash, 0, (result) => {
          console.log(result);
        });
        transporter.sendMail(mailOptions, (error, info) => {
          console.log(error, info);
        });
      }
    } else {
      if (flag === 5) {
        for (let i = 0; i < receivers.length; i++) {
          const hash = crypto.randomBytes(100).toString('hex');
          mailOptions = {
            from: '"DEK Competence Center" <dektech.dcc@gmail.com>',
            to: receivers[i].toString(),
            subject: `[Removed from class]${subject}`,
            html: `
                        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
                        <html xmlns="http://www.w3.org/1999/xhtml">
                          <head>
                            <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                            <meta name="viewport" content="width=device-width">
                            <title>Title</title>
                          </head>
                          <body>
                            <!-- <style> -->
                            <table class="body" data-made-with-foundation="">
                              <tr>
                                <td class="float-center" align="center" valign="top">
                                  <center data-parsed="">
                                    <table align="center" class="container header float-center">
                                      <tbody>
                                        <tr>
                                          <td>
                                            <table class="row">
                                              <tbody>
                                                <tr>
                                                  <th class="small-12 large-12 columns first last">
                                                    <table>
                                                      <tr>
                                                        <th>
                                                          <h2 class="text-center" style="padding-top:10px;">You have been removed from class</h2>
                                                          <center data-parsed="">
                                                          </center>
                                                        </th>
                                                      </tr>
                                                    </table>
                                                  </th>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    <table align="center" class="container body-border float-center" style="border-top: 8px solid #663399">
                                      <tbody>
                                        <tr>
                                          <td>
                                            <table class="row">
                                              <tbody>
                                                <tr>
                                                  <th class="small-12 large-12 columns first last">
                                                    <table>
                                                      <tr>
                                                        <th>
                                                          <table class="spacer">
                                                            <tbody>
                                                              <tr>
                                                                <td height="10px" style="font-size:10px;line-height:10px;">&#xA0;</td>
                                                              </tr>
                                                            </tbody>
                                                          </table>
                                                          <center data-parsed=""> <img src="http://sv1.upsieutoc.com/2017/11/01/DCC-icon.png" width="176" height="100" align="center" class="float-center" style="margin-top:5px; margin-bottom:5px"> </center>
                                                          <h2>${subject}</h2>
                                                          <table style="width: 100%; margin: 15px 0 5px 0; height: 135px; overflow: hidden; text-overflow: ellipsis; font-size: 14px; family-font: Times New Roman; text-align:left;">
                                                            <tr>
                                                                <td style="width: 25%; vertical-align:top; color: #000">Start Time: </td>
                                                                <td style="vertical-align:top">${(formatDate(content.startTime))}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="width: 25%; vertical-align:top; color: #000">End Time: </td>
                                                                <td style="vertical-align:top">${(formatDate(content.endTime))}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="width: 25%; vertical-align:top; color: #000">Location: </td>
                                                                <td style="vertical-align:top">${(content.location)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="width: 25%; vertical-align:top; color: #000">Trainer: </td>
                                                                <td style="vertical-align:top">${(content.trainer)}</td>
                                                            </tr>
                                                        </table>
                                                      <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; text-align: left">
                                                        <p style="font-size: 25px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 5px auto;" title="Description">Description</p>
                                                        <p style="font-size: 14px; overflow: auto; padding-bottom: 10px">${content.description}</p>
                                                      </div>
                                                      <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; text-align: left">
                                                        <p style="font-size: 20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;  margin: 5px auto; margin-top:7px" title="Description">Please contact your admin for more information.</p><br>
                                                      </div>
                                                        </th>
                                                        <th class="expander"></th>
                                                      </tr>
                                                    </table>
                                                  </th>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <footer>
                                              <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; font-size:14px; text-align: left; padding-top:5px; padding-left:3px;">
                                                <p>DEK Technologies Vietnam Co. Ltd.
                                                <br>Web: ${sign.website}
                                                <br><img src="https://itviec.com/employers/dek-technologies/logo/social/dek-technologies-logo.png?e2ZfGH9EqNcBbcQ7nKUpvkEb" width="100" height="100" style="display: block;">
                                                <br><i>With offices situated in Australia, Italy, Sweden and Vietnam,
                                                <br><i>DEK Technologies is ideally placed to be your global high technology partner.
                                                </p>
                                              </div>
                                            </footer>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </center>
                                </td>
                              </tr>
                            </table>
                          </body>
                        </html>
                        `,
          };
          //save status email reponse
          models.EmailResponseStatus.add(receivers[i], hash, 0, (result) => {
            console.log(result);
          });
          transporter.sendMail(mailOptions, (error, info) => {
            console.log(error, info);
          });
        }
      } else if (flag === 7) {
        mailOptions = {
          from: '"DEK Competence Center" <dektech.dcc@gmail.com>',
          to: receivers.toString(),
          subject: `[Return feedback] ${subject}`,
          html: `    
                    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
                    <html xmlns="http://www.w3.org/1999/xhtml">
                      <head>
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                        <meta name="viewport" content="width=device-width">
                        <title>Title</title>
                      </head>
                      <body>
                        <!-- <style> -->
                        <table class="body" data-made-with-foundation="">
                          <tr>
                            <td class="float-center" align="center" valign="top">
                              <center data-parsed="">
                                <table align="center" class="container header float-center">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table class="row">
                                          <tbody>
                                            <tr>
                                              <th class="small-12 large-12 columns first last">
                                                <table>
                                                  <tr>
                                                    <th>
                                                      <h1 class="text-center" style="padding-top:10px;">Thank you for joining in our course</h1>
                                                      <center data-parsed="">
                                                      </center>
                                                    </th>
                                                  </tr>
                                                </table>
                                              </th>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <table align="center" class="container body-border float-center" style="border-top: 8px solid #663399">
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table class="row">
                                          <tbody>
                                            <tr>
                                              <th class="small-12 large-12 columns first last">
                                                <table>
                                                  <tr>
                                                    <th>
                                                      <table class="spacer">
                                                        <tbody>
                                                          <tr>
                                                            <td height="10px" style="font-size:10px;line-height:10px;">&#xA0;</td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                      <center data-parsed=""> <img src="http://sv1.upsieutoc.com/2017/11/01/DCC-icon.png" width="176" height="100" align="center" class="float-center" style="margin-top:5px; margin-bottom:5px"> </center>
                                                      <h2>${subject}</h2>
                                                      <table style="width: 100%; margin: 15px 0 5px 0; height: 135px; overflow: hidden; text-overflow: ellipsis; font-size: 14px; family-font: Times New Roman; text-align:left;">
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">Start Time: </td>
                                                            <td style="vertical-align:top">${(formatDate(content.startTime))}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">End Time: </td>
                                                            <td style="vertical-align:top">${(formatDate(content.endTime))}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">Location: </td>
                                                            <td style="vertical-align:top">${(content.location)}</td>
                                                        </tr>
                                                        <tr>
                                                            <td style="width: 25%; vertical-align:top; color: #000">Trainer: </td>
                                                            <td style="vertical-align:top">${(content.trainer)}</td>
                                                        </tr>
                                                    </table>
                                                  <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; text-align: left">
                                                    <p style="font-size: 25px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 5px auto;" title="Description">Description</p>
                                                    <p style="font-size: 14px; overflow: auto; padding-bottom: 10px">${content.description}</p>
                                                  </div>
                                                  <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; text-align: left">
                                                    <p style="font-size: 20px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;  margin: 5px auto; margin-top:7px" title="Description">Please return feedback in <a href="http://192.168.122.20/#/login_user/feedback">this link</a> as soon as possible.</p><br>
                                                  </div>
                                                    </th>
                                                    <th class="expander"></th>
                                                  </tr>
                                                </table>
                                              </th>
                                            </tr>
                                          </tbody>
                                        </table>
                                            <footer>
                                              <div style="width: 100%; box-sizing: border-box; border-top: 1px solid #e5e5e5; font-size:14px; text-align: left; padding-top:5px; padding-left:3px;">
                                                <p>DEK Technologies Vietnam Co. Ltd.
                                                <br>Web: ${sign.website}
                                                <br><img src="https://itviec.com/employers/dek-technologies/logo/social/dek-technologies-logo.png?e2ZfGH9EqNcBbcQ7nKUpvkEb" width="100" height="100" style="display: block;">
                                                <br><i>With offices situated in Australia, Italy, Sweden and Vietnam,
                                                <br><i>DEK Technologies is ideally placed to be your global high technology partner.
                                                </p>
                                              </div>
                                          </footer>
                                        </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </center>
                            </td>
                          </tr>
                        </table>
                      </body>
                    </html>
                    `,
        }
        transporter.sendMail(mailOptions, (error, info) => {
          console.log(error, info);
        });
      } else {
        const mailOptions = {
          from: '"DEK Competence Center" <dektech.dcc@gmail.com>',
          to: receivers.toString(),
          subject: subject,
          text: content,
        };
        transporter.sendMail(mailOptions, (error, info) => {
          console.log(error, info);
        });
      }
    }
  }
};
module.exports = email;