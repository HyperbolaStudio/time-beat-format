import {HMSTime} from '../HMSTime';
let testList = [
    new HMSTime(),
    new HMSTime("5"),
    new HMSTime("10.3"),
    new HMSTime("10::.49"),//todo
    new HMSTime("10:5:367"),
    new HMSTime("10:35"),
    new HMSTime("3:5:21.5"),
    new HMSTime(".005"),
    new HMSTime(""),
    new HMSTime("114514"),
    new HMSTime("78:90:3:19675"),
    new HMSTime("myxr"),
    new HMSTime("10：5。03"),
    new HMSTime(19260817),
    new HMSTime(1926,0,8,17),
];
for(let x of testList)console.log(x.toString());
let t1=9812371,t2=876438;
let tObj1=new HMSTime(t1),tObj2=new HMSTime(t2);
tObj1.reduce(tObj2);
console.log(tObj1.toMillisecond(),tObj2.toMillisecond());
console.log(tObj1.increase(tObj2).toMillisecond(),t1+t2);
console.log(tObj1.offset(tObj2),t1-t2);