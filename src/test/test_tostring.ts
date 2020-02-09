import { HMSTime } from "../HMSTime";

let a = [
    new HMSTime('0:0.5',{
        numberWidthOption:{
            hour:-1,
            minute:-1,
            second:-1,
            millisecond:2
        }
    }),
];
for(let x of a){
    console.log(x.toString());
}