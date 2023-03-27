export const requestPasswordRequest=`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
</head>
<body>
    <table align='center' border='0' cellpadding='0' cellspacing='0' id='contenttable' style='margin-top: 20px; border-radius: 10px; background-color:#FFFFFF; text-align:center !important; margin-top:0 !important; margin-right: auto !important; margin-bottom:0 !important; margin-left: auto !important; width: 100% !important; max-width:695px !important;'>
        <tr>
          <td width='100%'>
       
                 <div style="margin-top: 20px; text-align:left">
                    <img border='0' alt="SmartCosmosLogo" src="https://scdevelopstorage.blob.core.windows.net/scimage/2eabbdb2194d7daa3e1802f37a59eed1" style='max-width:150px !important; height: 72px; width:100% !important; margin-bottom: 35px;'>
                </div>
            <table bgcolor='#FFFFFF' border='0' cellpadding='25' cellspacing='0' width='100%' style=" margin-bottom: 20px;">
              <tr>
                <td bgcolor='#FFFFFF' style='text-align:left;padding: 0px; font-weight: 600;font-size: 20px;' width='100%'>
                    
                    <h4 style="font-size: 14px; font-family: Nunito Sans;"> Dear {{name}},</h4>
                    <p style='word-break: break-word;align-items: center; font-weight: 400; color:#2E2E2E; font-family:Nunito Sans;font-style: normal;font-size:14px;letter-spacing: 0.07em; line-height:19px; margin-top:0; margin-bottom:20px; padding:0;'>
                    We received a request for a password reset on this account.To reset your password, please click on the link below.
                  </p>
                  <div><a href="{{link}}" style="text-decoration: none;"><button style="background: #227F99;font-size: 14px;color: #FFFFFF;font-family:Nunito Sans;font-weight: 600; text-transform: uppercase;text-align: center; border: none;border-radius: 5px;width: 190px;height: 45px;letter-spacing: .05em;">
                    <div style="display: inline-flex;"><span style="margin-top: 2px;">Reset Password</span></div></button></a></div>
                    <p style='word-break: break-word;align-items: center; font-weight: 400; color:#2E2E2E; font-family:Nunito Sans;font-style: normal;font-size:14px;letter-spacing: 0.07em; line-height:19px;  margin-top: 20px; margin-bottom:20px; padding:0;'>
                      If you did not request a password reset or no longer need the password reset, kindly ignore this email.
                    </p>
                    <p style='word-break: break-word;align-items: center; font-weight: 400; color:#2E2E2E; font-family:Nunito Sans;font-style: normal;font-size:14px;letter-spacing: 0.07em; line-height:19px;  margin-top: 20px; margin-bottom:20px; padding:0;'>
                    Note: This is a system generated message. This e-mail account is not monitored.
                    </p>
                  
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
</body>
</html>`

/****  to change your password
 * <h2 style="margin-bottom: 30px;color: #227F99;letter-spacing: 0.1em;font-family: 'Nunito Sans'; font-style: normal;line-height: 120%; margin-top:0px !important;">Forgot Password</h2>
<p style="font-family: 'Nunito Sans';font-style: normal;font-weight: 400;font-size: 10px;line-height: 157%;color: #898989;">If you did not request a new password, please ingnore this email.</p>
*/