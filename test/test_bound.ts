import { HMSTime } from "../HMSTime";

let testList=[
    new HMSTime("10::49"),//10:00:49
    new HMSTime("10:.49"),//0:10:00.49
    new HMSTime("10::.49"),//10:00:00.49
];
for(let x of testList)console.log(x.toString());