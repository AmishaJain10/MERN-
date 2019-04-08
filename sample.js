var a = function(status) {
  console.log("inside function a");
  console.log("Parameters received: " + status);
  console.log("------------------------------------");
};

function sleep(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

var b = async function(workName, callback) {
  console.log("I am working on:" + workName);
  console.log("I completed my work");
  console.log("------------------------------------");
  await sleep(5000);
  callback(workName + " completed");
  console.log("------------------------------------");
};

console.log("Callback example");
console.log("------------------------------------");

b("Run5Miles", a);

console.log("------------------------------------");

console.log("Callback example completed");
