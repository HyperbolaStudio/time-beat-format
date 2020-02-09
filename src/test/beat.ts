import { BeatTime } from "../BeatTime";
import { HMSTime } from "../HMSTime";

let option = {bpm:60,divisionsPerBeat:16,beatsPerNote:4,isRelativeTime:true};
let a = [
    new BeatTime(option),
    new BeatTime(option,new HMSTime('4')),
    new BeatTime(option,2,0,0),
    new BeatTime({...option,isRelativeTime:false},new HMSTime('4')),
]
for(let x of a){
    console.log(x.toString());
}