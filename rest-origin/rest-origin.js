module.exports = function (RED) {
    "use strict";

	// Ojo: Ver si esto está insalado de forma nativa
	// REF: https://stackoverflow.com/questions/6158933/how-to-make-an-http-post-request-in-node-js
    var request = require('request');

    function restOrigin(n) {
        // Create a RED node
        RED.nodes.createNode(this, n);

        // Store local copies of the node configuration (as defined in the .html)
        this.topic = n.topic;
        this.smartboxip = n.smartboxip;
		        
        // copy "this" object in case we need it in context of callbacks of other functions.
        var node = this;
		
		// create dummy json
		var jsonstr = '{"workingOrder": 288, "status":"idle", "isActive":true}';
		var dummyJSON = JSON.parse(jsonstr);

        // respond to inputs....
        this.on('input', function (msg) {
            sendPush(node.smartboxip, dummyJSON, function (res) {
                var msg = {};
                msg.payload = res;
                node.send(msg);
            });
        });

        this.on("close", function () {
            // Called when the node is shutdown - eg on redeploy.
            // Allows ports to be closed, connections dropped etc.
            // eg: node.client.disconnect();
        });
    }

    function sendPush(smartboxip, dummyJSON) {
        var epoch = new Date().getTime();

        var options = {
            url: smartboxip + ':7890/restdataorigin',
			body: dummyJSON,
			json: true,
            method: "POST"
        };
		
		request(options, function (err, res, body) {
			if (err)
			{
				return err;
			}
			return body;
		});
    }

    // Register the node by name. This must be called before overriding any of the
    // Node functions.
    RED.nodes.registerType("rest-origin", restOrigin);
}