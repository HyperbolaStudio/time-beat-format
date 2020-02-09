export class NegativeValueError extends TypeError{
    constructor(message?:string){
        super(message||"Value shouldn't be negative.");
    }
}
export interface NumberWidthOption{
    [property:string]:number|undefined;
}
export interface HMSTimeNumberWidthOption extends NumberWidthOption{
    hour?:number;
    minute?:number;
    second?:number;
    millisecond?:number;
}
export interface BeatTimeNumberWidthOption extends NumberWidthOption{
    note?:number;
    beat?:number;
    division?:number;
}
export interface HMSTimeOption{
    numberWidthOption?:HMSTimeNumberWidthOption;
}
export interface BeatTimeOption{
    bpm:number;
    beatsPerNote:number;
    divisionsPerBeat:number;
    isRelativeTime:boolean;
    numberWidthOption?:BeatTimeNumberWidthOption;
}
