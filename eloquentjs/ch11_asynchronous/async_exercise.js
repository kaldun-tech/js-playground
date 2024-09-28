/* There's a security camera near the lab activated by a motion sensor. It's connected to the network
 * and starts sending out a video stream when active. To not be discovered, Carla has set up a system
 * that notices this wireless network traffic and turns on a light when there is activity outside.
 * She's logging the times when the camera is tripped and will use this information to visualize
 * when tends to be quiet vs busy. The log is stored in files holding one time stamp number
 * as returned by Date.now() per line:
 * 1695709940692
 * 1695701068331
 * 1695701189163
 * The camera_logs.txt file holds a list of logfiles. Write an async function activityTable(day)
 * that for a given day of the week returns an array of 24 numbers, one for each hour of the day,
 * that hold the number of camera network observations seen in that hour. Days are identified by
 * Date.getDay where Sunday is 0 and Saturday is 6.
 * The activityGraph function in the sandbox summarizes such a tabl as a string.
 * To read the files use the textFile function defined earlier. Given a filename, it returns a
 * promise that resolves to the file's content. Remember that new Date(timestamp) creates a date
 * object for that time, which has getDay and getHours methods returning the day of week and
 * hour of day. Both types of files, the logfiles and the list of them, have each piece of data
 * on its own line separated by newline \n characters. */

// textFile from lesson
function textFile(filename) {
  return new Promise((resolve, reject) => {
    readTextFile(filename, (text, error) => {
      if (error) reject(error);
      else resolve(text);
    });
  });
}

async function activityTable(day) {
  let logFileList = await textFile("camera_logs.txt");
  function updateTableForEntry(table, entry, day) {
    date = new Date(entry);
    if (date.getDay() == day) {
      hour = date.getHour();
      ++table[hour];
    }
  }
  // Build table for individual textfile
  async function buildTable(table, logfile, day) {
    await textFile(logfile).then(() => {
      for (let entry of text) {
        updateTableForEntry(table, entry, day);
      }
    });
  }
  logFileList.then(() => {
    let table = new Array(24).fill(0);
    await Promise.all(
        logfiles.map(async (filename) => {
            buildTable(table, filename, day);
        });
    );
  });
}

activityTable(1).then((table) => console.log(activityGraph(table)));

/* Rewrite the function from the previous exercise without async/await using plain Promise methods.
 * In this style using Promise.all will be more convenient than trying to model a loop over the logfiles.
 * In the async function just using await in a loop is simpler. If reading the file takes some time
 * which approach takes the least time to run?
 * If a file has a typo and reading it fails, how does the failure end up in the Promise object
 * that your function returns? */
function activityTable(day) {
    // Your code here
  }
  
  activityTable(6)
    .then(table => console.log(activityGraph(table)));


/* As we saw, given an array of Promises, Promise.all returns a promise that waits for all the promises
 * in the array to finish. It then succeeds yielding an array of results. If a promise in the array fails
 * the promise returned by all fails too, passing on the failure reason from the failing promise.
 * Implment something like this as a regular function called Promise_all.
 * Remember that after a promise has succeeded or failed it can't succeed or fail again. Further calls
 * to the function that resolve it are ignored. This simplifies the way you handle a promise failure. */
function Promise_all(promises) {
    async function resolve_promise(promise, resolve, reject) {
        await promise().then(() => {
            resolve();
        }).catch(() => {
            reject();
        })
    };
    async function* handle_promise(promises, resolve, reject) {
        for (let promise of promises) {
            yield resolve_promise(promise, resolve, reject);
        }
    };
    return new Promise((resolve, reject) => {
      handle_promises(promises, resolve, reject);
    });
  }
  
  // Test code.
  Promise_all([]).then(array => {
    console.log("This should be []:", array);
  });
  function soon(val) {
    return new Promise(resolve => {
      setTimeout(() => resolve(val), Math.random() * 500);
    });
  }
  Promise_all([soon(1), soon(2), soon(3)]).then(array => {
    console.log("This should be [1, 2, 3]:", array);
  });
  Promise_all([soon(1), Promise.reject("X"), soon(3)])
    .then(array => {
      console.log("We should not get here");
    })
    .catch(error => {
      if (error != "X") {
        console.log("Unexpected failure:", error);
      }
    });