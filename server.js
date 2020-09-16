var express = require("express");
var path = require("path");
var obj = require("./app.js");
var PORT = process.env.PORT || 3000;
var app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function (req, res) {

    res.sendFile(path.join(__dirname, "./index.html"));
});

app.get("/survey", function (req, res) {
    res.sendFile(path.join(__dirname, "./survey.html"));
});

function compareFriends(userData) {
    var totalDifference = 0
    var bestMatchValue = 0
    var bestMatchIndex = 0
    // for loop running through the obj.friendsArray
    for (var i = 0; i < obj.friendsArray.length; i++) {
        // for loop running through the scores array of each friend
        for (var j = 0; j < obj.friendsArray[i].scores.length; j++) {
            // at each index, the absolute value of the difference is cacluated and added to
            // the totalDifference variable
            var indexDiff = Math.abs(obj.friendsArray[i].scores[j] - userData.scores[j])
            totalDifference += indexDiff
            // after the outer for loop finishes comparing the scores array...
            if (j + 1 === obj.friendsArray[i].scores.length) {
                // the first friend to the best match by default 
                if (i === 0) {
                    bestMatchValue = totalDifference
                    // we keep track of the best match's index in the obj.friendsArray
                    bestMatchIndex = i
                }
                // if any subsequent friends are more similar...
                else if (totalDifference < bestMatchValue) {
                    // that friend becomes the best match, and their index is stored
                    bestMatchValue = totalDifference
                    bestMatchIndex = i
                }
                // totalDifference is reset for the next friend
                totalDifference = 0
            }
        }
    }
    // when the original for loop finishes, the function returns the best matched 
    // friend's data by referring to that friend's index in the obj.friendsArray

    return obj.friendsArray[bestMatchIndex];
};

//Credit the above function to jz.


app.get("/api/friends", function (req, res) {
    return res.json(obj.friendsArray)
});

app.post("/api/friends", function (req, res) {
    var newRes = req.body


    res.json(compareFriends(newRes));
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});