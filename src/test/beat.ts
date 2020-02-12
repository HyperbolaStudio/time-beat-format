import { BeatTime } from "../BeatTime";
import { HMSTime } from "../HMSTime";

let option = {bpm:63,divisionsPerBeat:16,beatsPerNote:4,isRelativeTime:true};
let a = [
    new BeatTime(option,new HMSTime('4')),
]
for(let x of a){
    console.log(x.toString());
}