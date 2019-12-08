import { HMSTime,NegativeValueError } from "./HMSTime";

export interface BeatTimeConfig{
    bpm:number;
    beatsPerNote:number;
    divisionsPerBeat:number;
    isRelativeTime?:boolean;
}
export type OptionalBeatTimeConfig = {
    [P in keyof BeatTimeConfig]?:BeatTimeConfig[P]
}
export class BeatTime{

    static BEAT_REGEXP = /^([0-9]*)(:|：)?([0-9]*)(\.|。)?([0-9]*)$/;

    constructor(config:BeatTimeConfig,s:string);
    constructor(config:BeatTimeConfig,note:number,beat:number,division:number);
    constructor(config:BeatTimeConfig,hmsTime:HMSTime);
    constructor(config:BeatTimeConfig);
    constructor(config:BeatTimeConfig,...args:any[]){
        this._config = config;
        if(typeof(args[0])=='string'){
            this.parseString(args[0]);
        }else if(typeof(args[0])=='number' && typeof(args[1])=='number' && typeof(args[2])=='number'){
            this.parseNumber(...args);
        }else if(args[0] instanceof HMSTime){
            this.parseHMSTime(args[0]);
        }
    }

    protected _config:BeatTimeConfig;
    protected _note:number = 0;
    protected _beat:number = 0;
    protected _division:number = 0;
    get config(){
        return this._config;
    }
    get note(){
        return this._note;
    }
    get beat(){
        return this._beat;
    }
    get division(){
        return this._division;
    }

    setConfig(config:OptionalBeatTimeConfig):this{
        for(let i in config){
            (this._config as any)[i] = (config as any)[i];
        }
        return this;
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
        if(!this.config.isRelativeTime){
            if(note){
                note--;
            }
            if(beat){
                beat--;
            }
        }
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
        this._beat+=Math.floor(this.division/this.config.divisionsPerBeat);
        this._division%=this.config.divisionsPerBeat;
        this._note+=Math.floor(this.beat/this.config.beatsPerNote);
        this._beat=(this._beat)%this.config.divisionsPerBeat;
        
    }

    parseHMSTime(timeObj:HMSTime){
        let millisecond = timeObj.toMillisecond();
        let msPerNote = this.config.beatsPerNote*60*1000/this.config.bpm;
        let msPerBeat = 60*1000/this.config.bpm;
        let msPerDivision = msPerBeat/this.config.divisionsPerBeat;
        this.parseNumber(0,0,timeObj.toMillisecond()/msPerDivision);
    }


    toString():string{
        let noteDelta:number = this.config.isRelativeTime?0:1;
        return `${this.note+noteDelta}:${this.beat+noteDelta}.${this.division}`;
    }

    toHMSTime(){
        let msPerNote = this.config.beatsPerNote*60*1000/this.config.bpm;
        let msPerBeat = 60*1000/this.config.bpm;
        let msPerDivision = msPerBeat/this.config.divisionsPerBeat;
        let millisecond = this.note*msPerNote + this.beat*msPerBeat + this.division*msPerDivision;
        return new HMSTime(millisecond);
    }
}