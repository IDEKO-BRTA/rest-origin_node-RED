module.exports = function (RED) {
    "use strict";

    var request = require('request');

    function restOrigin(n) {
        // Create a RED node
        RED.nodes.createNode(this, n);

        // Store local copies of the node configuration (as defined in the .html)
        this.topic = n.topic;
        this.smartboxip = n.smartboxip;
        
        // copy "this" object in case we need it in context of callbacks of other functions.
        var node = this;

        // respond to inputs....
        this.on('input', function (msg) {
            
            // Get the JSON string fsrom payload and convert it to a JSON object
            var inputJSON = JSON.parse(msg.payload);
            
            // Send POST with the JSON object
            sendPOST(node, inputJSON);
        });

        this.on("close", function () {
            // Called when the node is shutdown - eg on redeploy.
            // Allows ports to be closed, connections dropped etc.
            // eg: node.client.disconnect();
        });
    }

    /*
    * Pushes via POST the JSON object content to the smartbox
    *
    * @param obj node - node object
    * @param obj inputJSON - JSON object to post
    */
    function sendPOST(node, inputJSON) {
		
        var options = {
            url: node.smartboxip + ':7890/restdataorigin',
            body: inputJSON,
            json: true,
            method: "POST"
        };
		
        // Submit request
        request(options, function (err, res, body) {
            var msg = {};
            if (err) msg.payload = err;
            msg.payload = body;
            node.send(msg);
        });
    }

    // Register the node by name. This must be called before overriding any of the
    // Node functions.
    RED.nodes.registerType("rest-origin", restOrigin);
}