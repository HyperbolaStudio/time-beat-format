import { HMSTime } from "./HMSTime";
import { NegativeValueError, BeatTimeOption } from "./definitions";
import { fillNumberWidth } from "./utils";

export class BeatTime{

    static BEAT_REGEXP = /^([0-9]*)(:|：)?([0-9]*)(\.|。|．)?([0-9]*)$/;

    constructor(option:BeatTimeOption,s:string);
    constructor(option:BeatTimeOption,note:number,beat:number,division:number);
    constructor(option:BeatTimeOption,hmsTime:HMSTime);
    constructor(option:BeatTimeOption,beatTime:BeatTime);
    constructor(option:BeatTimeOption);
    constructor(option:BeatTimeOption,...args:any[]){
        this._option = option;
        if(typeof(args[0])=='string'){
            this.parseString(args[0]);
        }else if(typeof(args[0])=='number' && typeof(args[1])=='number' && typeof(args[2])=='number'){
            this.parseNumber(...args);
        }else if(args[0] instanceof HMSTime){
            this.parseHMSTime(args[0]);
        }else if(args[0] instanceof BeatTime){
            this.parseHMSTime(args[0].toHMSTime());
        }
    }


    protected _option:BeatTimeOption;
    protected _note:number = 0;
    protected _beat:number = 0;
    protected _division:number = 0;
    get note(){
        let noteDelta:number = this._option.isRelativeTime?0:1;
        return this._note + noteDelta;
    }
    get beat(){
        let noteDelta:number = this._option.isRelativeTime?0:1;
        return this._beat + noteDelta;
    }
    get division(){
        return this._division;
    }
    set note(v:number){
        this.parseNumber(v);
    }
    set beat(v:number){
        this.parseNumber(undefined,v);
    }
    set division(v:number){
        this.parseNumber(undefined,undefined,v);
    }


    parseString(s:string){
        let noteStr = "";
        let beatStr = "";
        let divisionStr = "";
        s.replace(BeatTime.BEAT_REGEXP,(match,d1,p1,d2,p2,d3)=>{
            if(d2){
                beatStr = d2;
                noteStr = d1;
            }else{
                beatStr = d1;
            }
            if(d3){
                divisionStr = d3;
            }
            this.parseNumber(
                Number(noteStr),
                Number(beatStr),
                Number(divisionStr)
            )
            return match;
        });
    }

    parseNumber(note?:number,beat?:number,division?:number){
        let noteDelta:number = this._option.isRelativeTime?0:1;
        if(note)note-=noteDelta;
        if(beat)beat-=noteDelta
        if((note&&note<0)||(beat&&beat<0)||(division&&division<0)){
            throw new NegativeValueError();
        }
        if(note!==undefined){
            this._note = note;
        }
        if(beat!==undefined){
            this._beat = beat;
        }
        if(division!==undefined){
            this._division = division;
        }
        this._division = Math.round(this._division);
        this._beat+=Math.floor(this.division/this._option.divisionsPerBeat);
        this._division%=this._option.divisionsPerBeat;
        this._note+=Math.floor(this.beat/this._option.beatsPerNote);
        this._beat%=this._option.beatsPerNote;
        
    }

    parseHMSTime(timeObj:HMSTime){
        let noteDelta:number = this._option.isRelativeTime?0:1;
        let msPerBeat = 60*1000/this._option.bpm;
        let msPerDivision = msPerBeat/this._option.divisionsPerBeat;
        this.parseNumber(noteDelta,noteDelta,timeObj.toMillisecond()/msPerDivision);
    }


    toString():string{
        let note = fillNumberWidth(this.note,this._option.numberWidthOption?.note);
        let beat = fillNumberWidth(this.beat,this._option.numberWidthOption?.beat);
        let division = fillNumberWidth(this.division,this._option.numberWidthOption?.division);
        if(note)note+=':';
        if(division)division = '.'+division;
        return note+beat+division;
    }

    toHMSTime(){
        let msPerNote = this._option.beatsPerNote*60*1000/this._option.bpm;
        let msPerBeat = 60*1000/this._option.bpm;
        let msPerDivision = msPerBeat/this._option.divisionsPerBeat;
        let millisecond = this.note*msPerNote + this.beat*msPerBeat + this.division*msPerDivision;
        return new HMSTime(millisecond);
    }
}