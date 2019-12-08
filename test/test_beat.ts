import {BeatTime} from '../BeatTime';
const cfg1 = {bpm:120,beatsPerNote:4,divisionsPerBeat:16};
const cfg2 = {bpm:100,beatsPerNote:4,divisionsPerBeat:16,isRelative:true};
let testList=[
    new BeatTime(cfg1,5,2,8),
    new BeatTime(cfg2,5,2,8),
];
for(let x of testList)console.log(x.toString(),x.toHMSTime().toString());