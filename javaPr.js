var child = require('child_process').spawn(
  'java', ['-jar', 'NN_runner.jar']
);

child.stdout.on('data', function(data) {
    console.log(data.toString());
});

child.stderr.on("data", function (data) {
    console.log(data.toString());
});