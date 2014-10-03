/**
 * Created by Chairman Meow on 03/10/14.
 * Basic js error reporting library that catches any uncaught exceptions and
 * displays it to the user. Best used as a dev tool during development to quickly catch
 * any exceptions.
 *
 * Can be configured to send data back to the backend for audit. Could be used during dev
 * if you want to log possible errors that are happening without alerting the user
 *
 * Usage:
 * Just import the script and it should just work.
 * If you want to provide your own settings, import the script the set the global_ variables
 * below and then construct a new JSErrorAlert object with them as a json obj
 * i.e.
 *
 * <script src="jsErrorAlert.js"></script>
 * <script>
 *      new JSErrorAlert({showUser: boolean, userMessage: "yourMessage", audit: boolean, auditUrl: "url"});
 * </script>
 *
 * If you'd like to control the placement of the error message, add:
 * <span class="error_message"></span>
 * to your page add additional styles to the error_message class
 *
 * Default options:
 * global_showUser: boolean = whether to show the user a user friendly error message;
 * global_userMessage: string = friendly error message shown to the user;
 * global_audit: boolean = send audit message via ajax;
 * global_auditUrl: string = the url to send the audit data;
 */


globalObject = this;

//settings
var global_showUser = true;
var global_userMessage = "Uh oh, something bad happened, check the console for more details";
var global_audit = false;
var global_auditUrl = "http://some.json.endpoint";

/**
 * Construct and setup the library
 * @param obj
 * @constructor
 */
function JSErrorAlert(obj)
{
    this.showUser = obj.showUser;
    this.userMessage = obj.userMessage;
    this.audit = obj.audit;
    this.auditUrl = obj.auditUrl;
    globalObject.jsErrorAlertSettings = this;
    jsErrorAlertSetup();
}

/**
 * Setup the lib
 */
function jsErrorAlertSetup()
{
    //attach a function to the on error function which is called when an exception reaches window
    globalObject.onerror = function(msg, url, line, col, error){
        var newLine = "\t\n";
        msg = newLine + "MESSAGE: " + msg;
        url = newLine + "URL: " + url;
        line = newLine + "LINE: " + line;
        col = newLine + "COL: " + col;

        var fullMessage = msg + url + line + col;
        console.log("Exception Occurred:", msg, url, line, col);
        console.log(error);

        if(globalObject.jsErrorAlertSettings.showUser)
        {
            defaultAlertMessage();
        }

        if(globalObject.jsErrorAlertSettings.audit)
        {
            //old skool
            var request = new XMLHttpRequest();

            //callback
            request.onreadystatechange = function()
            {
               //if all is good after the audit
               if(request.status === 200 && request.readyState === 4)
               {
                   console.log("audit sent to:" + globalObject.jsErrorAlertSettings.auditUrl);
               }
            };

            request.open("POST", globalObject.jsErrorAlertSettings.auditUrl);
            request.send(fullMessage);
        }

    };


    //if the message element doesn't exist on the page then create one.
    var errorMessage = globalObject.document.getElementsByClassName("error_message")[0];
    if(!errorMessage)
    {
        var span = globalObject.document.createElement("span");
        var message = globalObject.document.createTextNode(globalObject.jsErrorAlertSettings.userMessage);
        span.appendChild(message);
        var body = globalObject.document.getElementsByTagName("body")[0];
        body.insertBefore(span, body.firstChild);
    }
    return this;
}

//construct settings and run setup
new JSErrorAlert({showUser: global_showUser, userMessage: global_userMessage,
    audit: global_audit, auditUrl: global_auditUrl});


function defaultAlertMessage(){
    showMessage();
}

function showMessage()
{
    var errorMessage = globalObject.document.getElementsByClassName("error_message")[0];
    errorMessage.textContent = globalObject.jsErrorAlertSettings.userMessage;
    errorMessage.className = "error_message show";
    setTimeout(hideMessage, 5000);
}

function hideMessage()
{
    var errorMessage = globalObject.document.getElementsByClassName("error_message")[0];
    errorMessage.className = "error_message hide";
}


function testError()
{
    throw new Error("sdfsdfsd");
}